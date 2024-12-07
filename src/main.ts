import 'dotenv/config';

import { Telegraf } from 'telegraf';

import { connectToDatabase } from './config/database';
import registerCommands from './commands';

const isProduction = process.env.NODE_ENV === 'production';
const TG_BOT_WEBHOOK_URL = process.env.TG_BOT_WEBHOOK_URL!;
const TG_BOT_API_TOKEN = process.env.TG_BOT_API_TOKEN!;

const bot = new Telegraf(TG_BOT_API_TOKEN);

registerCommands(bot);

connectToDatabase().then(async (mongoose) => {
  await bot
    .launch(
      isProduction
        ? {
            webhook: {
              domain: TG_BOT_WEBHOOK_URL,
              port: Number(process.env.PORT || '3000'),
            },
          }
        : {},
      () => console.log('✅ Bot launched'),
    )
    .catch((err) => {
      console.error('❌ An error during bot launch:', err);
      mongoose.disconnect();
    });
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
