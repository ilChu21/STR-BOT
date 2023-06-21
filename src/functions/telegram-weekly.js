import fs from 'fs';
import { getQualifiedEntries } from './qualified.js';
import { getBlockRange } from './blocks.js';
import { CHAT_ID, MSG_THREAD_ID_2 } from '../utils/env-vars.js';
import { getTodaysDate } from '../utils/dates.js';
import { numFor } from '../utils/format.js';

const opts = {
  message_thread_id: MSG_THREAD_ID_2,
  parse_mode: 'Markdown',
};

export async function msgResults(bot, provider) {
  try {
    const { previousEndBlock, latestBlock } = await getBlockRange(provider);
    const qualified = await getQualifiedEntries(provider);
    const totalEntries = qualified.results.length;
    const totalAccounts = qualified.totalAccounts;
    let totalBNB = 0;

    const accountList = qualified.results
      .map(
        (entry) => `${abbreviateAddress(entry.from)},${entry.from},${entry.bnb}`
      )
      .join('\n');

    for (const entry of qualified.results) {
      totalBNB += entry.bnb;
    }

    const filePath = `qualified-${previousEndBlock}-${latestBlock}.csv`;
    await saveAccountListToCSV(accountList, filePath);

    const fileStream = fs.createReadStream(filePath);
    await bot.sendDocument(CHAT_ID, fileStream, {
      message_thread_id: MSG_THREAD_ID_2,
    });

    bot.sendMessage(
      CHAT_ID,
      `
*Total Entries:* ${totalEntries}
*Total distinct accounts:* ${totalAccounts}
*Total BNB (post tax):* ${numFor.format(totalBNB)}`,
      opts
    );

    fileStream.close();
    await deleteFile(filePath);
  } catch (error) {
    console.error('❌ msgResults()', error);
  }
}

async function saveAccountListToCSV(accountList, filePath) {
  const currentDate = getTodaysDate();
  const csvContent = `Date: ${currentDate}\n${accountList.replace(
    /\n/g,
    '\r\n'
  )}`;
  await fs.promises.writeFile(filePath, csvContent);
}

async function deleteFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (error) {
    console.error('❌ deleteFile()', error);
  }
}

function abbreviateAddress(address) {
  const prefixLength = 4;
  const suffixLength = 4;
  const abbreviation = `${address.slice(0, prefixLength)}....${address.slice(
    -suffixLength
  )}`;
  return abbreviation;
}
