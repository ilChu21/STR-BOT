import { ethers } from 'ethers';
import { FAUCET_ADDRESS, FAUCET_ABI } from '../contracts/faucet.js';

export async function walletInfo(address, provider) {
  try {
    const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, provider);
    const result = await contract.userInfoTotals(address);

    const formattedResult = {};
    const variableNames = [
      'referrals',
      'totalDeposits',
      'totalPayouts',
      'totalStructure',
      'airdropsTotal',
      'aridropsReceived',
    ];

    for (let i = 0; i < result.length; i++) {
      const variableName = variableNames[i];
      const formattedValue = ethers.utils.formatEther(result[i]);
      formattedResult[variableName] = formattedValue;
    }

    return formattedResult;
  } catch (error) {
    console.error('❌ walletInfo()', error);
  }
}
