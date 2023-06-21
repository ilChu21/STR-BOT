import { getWeeksSince } from '../utils/dates.js';
import { walletInfo } from './faucet.js';
import { CHAT_ID, MSG_THREAD_ID } from '../utils/env-vars.js';

const STR_ADDRESS = '0x81397EdF57Fc97759Dd3a964c03114D14eFD564A';
const campaignStartDate = new Date('2023-05-01');

const opts = {
  message_thread_id: MSG_THREAD_ID,
  parse_mode: 'Markdown',
};

export async function cronTelegramMsg(bot, provider) {
  try {
    const result = await walletInfo(STR_ADDRESS, provider);

    bot.sendMessage(
      CHAT_ID,
      `
Week ${getWeeksSince(campaignStartDate) + 1} of Campaign
      
*TOTALS*
Participants:
BNB Deposited in Reservoir:
Total DRIP Airdropped: ${result.airdropsTotal}`,
      opts
    );
  } catch (error) {
    console.error('❌ cronTelegramMsg()', error);
  }
}
