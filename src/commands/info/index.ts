import { Telegraf } from 'telegraf';

import {
  commandStateHandler,
  helpHandler,
  startHandler,
  statusHandler,
} from './info.command';
import { supportHandler } from './support.command';

export const registerInfoCommands = (bot: Telegraf) => {
  bot.command('help', helpHandler);
  bot.command('status', statusHandler);
  bot.command('support', supportHandler);
  bot.command('state', commandStateHandler);
  bot.command('start', startHandler);
};

export { handleSupportSteps } from './support.command';
