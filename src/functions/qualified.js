import { ethers } from 'ethers';
import { FOUNTAIN_ADDRESS } from '../contracts/fountain.js';
import { getTokenTxs, getAccountTxs } from './api.js';
import { getBlockRange } from './blocks.js';
import { sleep } from '../utils/sleep.js';
import {
  RESERVOIR_ADDRESS,
  METHOD_ID_BUY,
  METHOD_ID_SELL,
  RESERVOIR_TOPIC,
  MINT_TOPIC,
  TRANSFER_TOPIC,
} from '../contracts/reservoir.js';

async function getPreQualifiedEntries(provider) {
  console.log(`Starting getPreQualifiedEntries()`);
  try {
    const { previousEndBlock, latestBlock } = await getBlockRange(provider);

    let startBlock = previousEndBlock;
    const endBlock = latestBlock;

    const results = [];

    let currentProcessedHash;

    let processedHash = {
      add: (hash) => {
        currentProcessedHash = hash;
      },
      has: (hash) => {
        return currentProcessedHash === hash;
      },
    };

    while (startBlock <= endBlock) {
      const fountainTxs = await getTokenTxs(
        FOUNTAIN_ADDRESS,
        startBlock,
        endBlock
      );

      const fountainTxsLength = fountainTxs.data.result.length;

      if (fountainTxsLength === 0) {
        break;
      }

      for (const event of fountainTxs.data.result) {
        if (event.to === RESERVOIR_ADDRESS.toLowerCase()) {
          if (!processedHash.has(event.hash)) {
            processedHash.add(event.hash);
            const tx = await provider.getTransaction(event.hash);
            if (tx && tx.data.substring(0, 10) === METHOD_ID_BUY) {
              const value = ethers.utils.formatEther(tx.value);
              const valuePostTax = value * 0.9;
              if (valuePostTax >= 0.1) {
                const receipt = await provider.getTransactionReceipt(
                  event.hash
                );
                const logs = receipt.logs;
                let dropAmount = ethers.BigNumber.from(0);
                for (const log of logs) {
                  if (
                    log.topics[0] === TRANSFER_TOPIC &&
                    log.topics[1] === MINT_TOPIC &&
                    log.topics[2] === RESERVOIR_TOPIC
                  ) {
                    const isDropAmount = ethers.BigNumber.from(log.data);
                    if (isDropAmount.gt(dropAmount)) {
                      dropAmount = isDropAmount;
                    }
                  }
                }

                const formattedDropAmount =
                  ethers.utils.formatEther(dropAmount);

                const dropInPostTax = formattedDropAmount * 0.9;

                results.push({
                  from: tx.from,
                  bnb: valuePostTax,
                  drops: dropInPostTax,
                });
              }
            }
          }
        }
      }
      if (fountainTxsLength < 10000) {
        break;
      }

      startBlock = parseInt(
        fountainTxs.data.result[fountainTxs.data.result.length - 1].blockNumber
      );
    }

    console.log('getPreQualifiedEntries() finished');
    return results;
  } catch (error) {
    console.error('❌ getPreQualifiedEntries()', error);
  }
}

export async function getQualifiedEntries(provider) {
  console.log(`Starting getQualifiedEntries()`);
  try {
    let results = await getPreQualifiedEntries(provider);
    const { previousEndBlock, latestBlock } = await getBlockRange(provider);

    const accountTotals = {};

    for (const result of results) {
      const drops = parseFloat(result.drops);
      if (!accountTotals[result.from]) {
        accountTotals[result.from] = drops;
      } else {
        accountTotals[result.from] += drops;
      }
    }

    const totalAccounts = Object.keys(accountTotals).length;

    console.log('Starting getAccountTxs()');
    for (const [account, total] of Object.entries(accountTotals)) {
      if (account) {
        let dropsOut = 0;
        const accountTxs = await getAccountTxs(
          account,
          previousEndBlock,
          latestBlock
        );
        for (const tx of accountTxs.data.result) {
          if (
            tx &&
            tx.methodId === METHOD_ID_SELL &&
            tx.to === RESERVOIR_ADDRESS.toLowerCase() &&
            tx.txreceipt_status === '1'
          ) {
            const valueHex = tx.input.slice(-64);
            const valueBN = ethers.BigNumber.from(`0x${valueHex}`);
            dropsOut += parseFloat(ethers.utils.formatEther(valueBN));
          }
        }
        if (dropsOut.toFixed(10) >= total.toFixed(10)) {
          results = results.filter((result) => result.from !== account);
        }
      }
      await sleep(500);
    }
    console.log('getAccountTxs() finished');
    console.log('getQualifiedEntries() finished');
    return { results, totalAccounts };
  } catch (error) {
    console.error('❌ getQualifiedEntries()', error);
  }
}
