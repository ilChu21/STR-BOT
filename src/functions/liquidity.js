import { ethers } from 'ethers';
import { BEP20_ABI } from '../contracts/bep20-abi.js';

export async function getBalanceOf(tokenAddress, contractAddress, provider) {
  try {
    const contract = new ethers.Contract(tokenAddress, BEP20_ABI, provider);
    return ethers.utils.formatEther(await contract.balanceOf(contractAddress));
  } catch (error) {
    console.error('❌ getBalanceOf()', error);
  }
}

export async function calculateLiquidity(tokenBalance, tokenPrice) {
  try {
    return (await tokenBalance) * (await tokenPrice) * 2;
  } catch (error) {
    console.error('❌ calculateLiquidity()', error);
  }
}

export async function getCirculatingLp(lpAddress, provider) {
  try {
    const contract = new ethers.Contract(lpAddress, BEP20_ABI, provider);
    return ethers.utils.formatEther(await contract.totalSupply());
  } catch (error) {
    console.error('❌ getCirculatingLp()', error);
  }
}

export async function calculateLpPrice(liquidity, circulatingLp) {
  try {
    return (await liquidity) / (await circulatingLp);
  } catch (error) {
    console.error('❌ calculateLpPrice()', error);
  }
}
