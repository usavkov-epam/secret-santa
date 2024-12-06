import { Context } from 'telegraf';

import { seasonService } from '../../services';

/**
 * Shows the help message.
 */
export const helpHandler = (ctx: Context) => {
  ctx.reply(`
    Available commands:
    /launch_season <name> <endDate> - Start a new season (admin)
    /end_season - End the current season (admin)
    /add_participant <username> - Add a participant (admin)
    /remove_participant <username> - Remove a participant (admin)
    /list_participants - List all participants (admin)
    /list_seasons - List all seasons (admin)
    /join - Join the current season
    /leave - Leave the current season
    /recipient - See your recipient
    /help - Show this help message
    /status - Show current season status
  `);
};

/**
 * Shows the current status of the season.
 */
export const statusHandler = async (ctx: Context) => {
  try {
    const status = await seasonService.getCurrentSeasonStatus();
    ctx.reply(status);
  } catch (error) {
    ctx.reply(`Error: ${(error as Error).message}`);
  }
};
