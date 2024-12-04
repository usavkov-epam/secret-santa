import 'dotenv/config';

import { Telegraf } from 'telegraf';

import { connectToDatabase } from './config/database';
import registerCommands from './commands';

const bot = new Telegraf(process.env.TG_BOT_API_TOKEN!);

registerCommands(bot);

connectToDatabase()
  .then(async (mongoose) => {
    await bot.launch(() => console.log('✅ Bot launched'))
      .catch((err) => {
        console.error('❌ An error during bot launch:', err);
        mongoose.disconnect();
      });
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
