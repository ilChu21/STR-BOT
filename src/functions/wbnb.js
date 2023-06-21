import { ethers } from 'ethers';
import { MAT_ADDRESS, MAT_ABI } from '../contracts/mat-contract.js';

export async function getBnbPrice(provider) {
  try {
    const contract = new ethers.Contract(MAT_ADDRESS, MAT_ABI, provider);
    return ethers.utils.formatEther(await contract.getBnbPrice());
  } catch (error) {
    console.error('❌ getBnbPrice()', error);
  }
}
