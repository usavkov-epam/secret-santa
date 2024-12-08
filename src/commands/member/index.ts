import { Telegraf } from 'telegraf';

import { joinHandler } from './join.command';
import {
  leaveHandler,
  myRecipientHandler,
} from './member.command';

export const registerMemberCommands = (bot: Telegraf) => {
  bot.command('join', joinHandler);
  bot.command('leave', leaveHandler);
  bot.command('recipient', myRecipientHandler);
};

export {
  handleJoinSteps,
  joinCommandSteps,
} from './join.command';
