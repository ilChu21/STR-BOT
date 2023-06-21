import { WBNB_ADDRESS } from '../contracts/wbnb.js';
import { FOUNTAIN_ADDRESS } from '../contracts/fountain.js';
import {
  calculateLiquidity,
  calculateLpPrice,
  getCirculatingLp,
  getBalanceOf,
} from './liquidity.js';
import { getBnbPrice } from './wbnb.js';

export async function fountainLiquidity(provider) {
  try {
    return await calculateLiquidity(
      await getBalanceOf(WBNB_ADDRESS, FOUNTAIN_ADDRESS, provider),
      await getBnbPrice(provider)
    );
  } catch (error) {
    console.error('❌ fountainLiquidity()', error);
  }
}

export async function circulatingDrop(provider) {
  try {
    return await getCirculatingLp(FOUNTAIN_ADDRESS, provider);
  } catch (error) {
    console.error('❌ circulatingDrop()', error);
  }
}

export async function getDropPrice(provider) {
  try {
    return await calculateLpPrice(
      await fountainLiquidity(provider),
      await circulatingDrop(provider)
    );
  } catch (error) {
    console.error('❌ getDropPrice()', error);
  }
}
