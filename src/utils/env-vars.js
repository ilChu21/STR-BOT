import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// export const NTBA_FIX_350 = process.env.NTBA_FIX_350;
export const DATABASE_URL = process.env.DATABASE_URL;
export const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
export const CHAT_ID = process.env.CHAT_ID;
export const MSG_THREAD_ID = process.env.MSG_THREAD_ID;
export const MSG_THREAD_ID_2 = process.env.MSG_THREAD_ID_2;
export const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
