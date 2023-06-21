import axios from 'axios';
import { BSCSCAN_API_KEY } from '../utils/env-vars.js';

export async function getTokenTxs(address, startBlock, endBlock) {
  try {
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${BSCSCAN_API_KEY}`;
    return await axios.get(url, { retry: 2, retryDelay: 1000 });
  } catch (error) {
    console.error('❌ getTokenTxs()', error);
  }
}

export async function getAccountTxs(address, startBlock, endBlock) {
  try {
    return await axios.get(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${BSCSCAN_API_KEY}`,
      { retry: 2, retryDelay: 1000 }
    );
  } catch (error) {
    console.error('❌ getAccountTxs()', error);
  }
}
