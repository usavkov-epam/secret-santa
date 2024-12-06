import { Context } from 'telegraf';

import { seasonService } from '../../services';

/**
 * Shows the help message.
 */
export const helpHandler = (ctx: Context) => {
  ctx.reply(`
    Available commands:
    /launch <name> <endDate> - Start a new season (admin)
    /endseason - End the current season (admin)
    /addparticipant <username> - Add a participant (admin)
    /removeparticipant <username> - Remove a participant (admin)
    /listparticipants - List all participants (admin)
    /listseasons - List all seasons (admin)
    /join - Join the current season
    /leave - Leave the current season
    /myrecipient - See your recipient
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
