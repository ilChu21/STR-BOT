import cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_API_KEY } from './utils/env-vars.js';
import { createProvider } from './functions/providers.js';
import { msgResults } from './functions/telegram-weekly.js';
// import { cronTelegramMsg } from '../functions/telegram-msg.js';

const token = TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });
console.log('✅ STR Telegram bot online.');

async function main() {
  try {
    // cron.schedule('* * * * *', async () => {
    //   const provider = createProvider();
    //   await cronTelegramMsg(bot, provider);
    // });

    // cron.schedule('*/5 * * * *', async () => {
    //   const provider = createProvider();
    //   await msgResults(bot, provider);
    //   console.log('✅ finished run');
    // });

    const provider = createProvider();
    await msgResults(bot, provider);
    console.log('✅ finished run');
  } catch (error) {
    console.error('❌ main()', error);
  }
}

await main();
