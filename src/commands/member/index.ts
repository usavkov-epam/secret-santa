import { Telegraf } from 'telegraf';

import { joinHandler } from './join.command';
import {
  myRecipientHandler,
} from './recipient.command';
import {
  myWishHandler,
  updateWishHandler,
} from './wish.command';
import { leaveHandler } from './leave.command';
import {
  myLinkHandler,
  updateSharedLinkHandler,
} from './shared-link.command';

export const registerMemberCommands = (bot: Telegraf) => {
  bot.command('join', joinHandler);
  bot.command('leave', leaveHandler);
  bot.command('recipient', myRecipientHandler);
  bot.command('wish', myWishHandler);
  bot.command('update_wish', updateWishHandler);
  bot.command('shared_link', myLinkHandler);
  bot.command('update_shared_link', updateSharedLinkHandler);
};

export {
  handleJoinSteps,
  joinCommandSteps,
} from './join.command';
export {
  handleUpdateSharedLinkSteps,
  updateSharedLinkCommandSteps,
} from './shared-link.command';
export {
  handleUpdateWishSteps,
  updateWishCommandSteps,
} from './wish.command';
