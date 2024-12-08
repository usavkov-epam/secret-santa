import { Context } from 'telegraf';

import { commandService, currentSeasonService, seasonService } from '../../services';
import { getProgressBar, isAdmin } from '../../utils';

const commonCommands = [
  '/join - Join the current season',
  '/leave - Leave the current season',
  '/recipient - See your recipient',
  '/support - Send a message to support team',
  '/help - Show helpful message',
  '/status - Show current season status',
  '/state - Show active command state',
  '/cancel - Cancel the current operation',
];

const adminCommands = [
  '/launch_season <name> <endDate> - Start a new season (admin)',
  '/freeze_season - Freeze the current season (admin)',
  '/end_season - End the current season (admin)',
  '/add_participant <username> - Add a participant (admin)',
  '/remove_participant <username> - Remove a participant (admin)',
  '/list_participants - List all participants (admin)',
  '/list_seasons - List all seasons (admin)',
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
      return ctx.reply('❕ No active command state found');
    }

    ctx.reply(`Current state: ${state.command}: ${getProgressBar(state.step, 3)}`);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};
