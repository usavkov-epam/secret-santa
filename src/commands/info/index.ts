import { Telegraf } from 'telegraf';

import {
  helpHandler,
  statusHandler,
} from './info.command';
import { supportHandler } from './support.command';

export const registerInfoCommands = (bot: Telegraf) => {
  bot.command('help', helpHandler);
  bot.command('status', statusHandler);
  bot.command('support', supportHandler);
};

export { handleSupportSteps } from './support.command';
