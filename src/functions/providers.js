import { ethers } from 'ethers';

const PUBLIC_RPC_URL = 'https://bscrpc.com/';

export function createProvider() {
  try {
    return new ethers.providers.JsonRpcProvider(PUBLIC_RPC_URL);
  } catch (error) {
    console.error('❌ createProvider()', error);
  }
}
