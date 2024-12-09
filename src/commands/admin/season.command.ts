import { Context } from 'telegraf';

import { seasonService } from '../../services';
import {
  isAdmin,
  sanitizeForMarkdown,
} from '../../utils';

/**
 * Handler for the /create_season command.
 * Only accessible by admins.
 */
export const createSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    const { message } = ctx;

    if (message && 'text' in message) {
      const args = message.text.split(' ').slice(1);

      if (args.length === 0) {
        ctx.reply('❌ Please provide a name for the season. Example: /create_season Christmas2024');
        return;
      }

      const seasonName = args[0];
      const endDate = args[1] ? new Date(args[1]) : undefined;

      const newSeason = await seasonService.createSeason(seasonName, endDate);
      ctx.reply(`✔️ Season "${newSeason.name}" has been successfully created!`);
    } else {
      ctx.reply('❌ This message does not contain valid text.');
    }
  } catch (error) {
    if (error instanceof Error) {
      ctx.reply(`❌ Failed to start a new season: ${error.message}`);
    } else {
      ctx.reply('❌ An unknown error occurred.');
    }
  }
};

/**
 * Lists all seasons.
 */
export const listSeasonsHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    const seasons = await seasonService.getAllSeasons();

    if (seasons.length === 0) {
      return ctx.reply('No seasons available.');
    }

    const list = seasons.map((s) => {
      return `\\- \`${sanitizeForMarkdown(s.name)}\`: *${sanitizeForMarkdown(s.status)}*`
    }).join(' \n');

    ctx.reply(`Seasons:\n${list}`, {  parse_mode: 'MarkdownV2' });
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};
