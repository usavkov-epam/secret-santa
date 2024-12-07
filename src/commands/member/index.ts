import { Telegraf } from 'telegraf';

import {
  joinHandler,
  leaveHandler,
  myRecipientHandler,
} from './member.command';

export const registerMemberCommands = (bot: Telegraf) => {
  bot.command('start', console.log);
  bot.command('join', joinHandler);
  bot.command('leave', leaveHandler);
  bot.command('recipient', myRecipientHandler);

};
