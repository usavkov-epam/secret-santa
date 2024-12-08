import { Context } from 'telegraf';

import { SeasonStatus } from '../../enums';
import {
  currentSeasonService,
  seasonService,
} from '../../services';
import { isAdmin } from '../../utils';

/**
 * Handler for the /launch command.
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
        ctx.reply('❌ Please provide a name for the season. Example: /launch Christmas2024');
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

export const launchSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  if (!ctx.message || !('text' in ctx.message)) {
    return ctx.reply('❌ This message does not contain valid text.');
  }

  const seasonName = ctx.message.text.split(' ').slice(1).join(' ');

  if (!seasonName) {
    return ctx.reply('❌ Please provide a name for the season. Example: /launch_season Christmas2024');
  }

  await currentSeasonService.startCurrentSeason(seasonName);

  ctx.reply(`✔️ Season "${seasonName}" has been successfully launched!`);
}

export const freezeSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  await currentSeasonService.freezeCurrentSeason();
};

/**
 * Ends the current season.
 */
export const endSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    const season = await currentSeasonService.endCurrentSeason();
    ctx.reply(`✔️ Season "${season.name}" ended successfully!`);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
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
      const isActive = s.status === SeasonStatus.Active;

      return `- ${s.name} (${isActive ? 'Active' : 'Ended'})`
    }).join('\n');

    ctx.reply(`Seasons:\n${list}`);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};
