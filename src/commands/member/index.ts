import { Telegraf } from 'telegraf';

import { joinHandler } from './join.command';
import {
  leaveHandler,
  myLinkHandler,
  myRecipientHandler,
} from './member.command';
import {
  myWishHandler,
  updateWishHandler,
} from './wish.command';

export const registerMemberCommands = (bot: Telegraf) => {
  bot.command('join', joinHandler);
  bot.command('leave', leaveHandler);
  bot.command('recipient', myRecipientHandler);
  bot.command('wish', myWishHandler);
  bot.command('update_wish', updateWishHandler);
  bot.command('shared_link', myLinkHandler);
};

export {
  handleJoinSteps,
  joinCommandSteps,
} from './join.command';
export {
  handleUpdateWishSteps,
  updateWishCommandSteps,
} from './wish.command';
