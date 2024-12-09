import { Context } from 'telegraf';

import {
  commandService,
  currentSeasonService,
} from '../../services';
import {
  getProgressBar,
  isAdmin,
} from '../../utils';
import { launchSeasonCommandSteps } from '../admin';
import {
  joinCommandSteps,
  updateSharedLinkCommandSteps,
  updateWishCommandSteps,
} from '../member';
import { supportCommandSteps } from './support.command';

const commandsDict: any /* TODO: specify type */ = {
  'launch_season': launchSeasonCommandSteps,
  'support': supportCommandSteps,
  'join': joinCommandSteps,
  'update_wish': updateWishCommandSteps,
  'update_shared_link': updateSharedLinkCommandSteps,
};

const commonCommands = [
  '/join - Join the current season',
  '/leave - Leave the current season',
  '/recipient - See your recipient',
  '/wish - See your wish',
  '/update_wish - Update your wish',
  '/shared_link - Get your profile link',
  '/update_shared_link - Update your profile link',
  '/support - Send a message to support team',
  '/help - Show helpful message',
  '/state - Show active command state',
  '/cancel - Cancel the current operation',
];

const adminCommands = [
  '/status - Show current season status',
  '/launch_season <name> <endDate> - Start a new season (admin)',
  '/freeze_season - Freeze the current season (admin)',
  '/end_season - End the current season (admin)',
  '/add_participant <username> - Add a participant (admin)',
  '/remove_participant <username> - Remove a participant (admin)',
  '/list_participants - List all participants (admin)',
  '/list_seasons - List all seasons (admin)',
  '/distribute_participants - Distribute participants (admin)',
  '/notify_assignment - Notify participants about their assignment (admin)',
];

/**
 * Shows the help message.
 */
export const helpHandler = (ctx: Context) => {
  const isAdminUser = isAdmin(ctx.from?.id);

  ctx.reply(`
    Available commands:\n${commonCommands.join('\n')}
    ${isAdminUser ? '\nAdmin commands:' : ''}\n${isAdminUser ? adminCommands.join('\n') : ''}
  `);
};

/**
 * Shows the current status of the season.
 */
export const statusHandler = async (ctx: Context) => {
  try {
    const status = await currentSeasonService.getCurrentSeasonStatus();

    ctx.reply(status);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};

/*
 * Display active command state 
 */
export const commandStateHandler = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('❌ User not found');
  }

  try {
    const state = await commandService.getState(ctx.from.id);

    if (!state) {
      return ctx.reply('❕No active command state found');
    }

    ctx.reply(`Current state:\n${state.command}: ${getProgressBar(state.step - 1, commandsDict[state.command]?.length)}`);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};

export const startHandler = (ctx: Context) => {
  ctx.reply(
    `*Hello! 👋 Welcome to the Secret Santa Bot! 🎅🎁*\n\n` +
      `I’m here to make your Secret Santa experience fun and effortless.\n` +
      `You can:\n` +
      `🎉 Join the current season.\n` +
      `🎁 Share your preferences and help your Santa pick the perfect gift.\n` +
      `🔔 Get notified when the exchange is ready.\n\n` +
      `Type /join to participate in this season, or /help for more details.\n\n` +
      `Let’s make this holiday season magical! ✨`,
    { parse_mode: 'Markdown' } // Enables Markdown formatting
  );
};
