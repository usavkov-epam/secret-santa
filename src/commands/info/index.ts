import { Telegraf } from 'telegraf';

import {
  helpHandler,
  statusHandler,
} from './info.command';

export const registerInfoCommands = (bot: Telegraf) => {
  bot.command('help', helpHandler);
  bot.command('status', statusHandler);
};
