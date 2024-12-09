import { Context } from 'telegraf';

import { currentSeasonService } from '../../services';
import { isAdmin } from '../../utils';

export const freezeCurrentSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    await currentSeasonService.freezeCurrentSeason();
    ctx.reply('✔️ The current season has been frozen.');
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};

/**
 * Ends the current season.
 */
export const endCurrentSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    const currentSeason = await currentSeasonService.getCurrentSeason();
    
    if (!currentSeason) {
      return ctx.reply('❌ No active season found.');
    }

    await currentSeasonService.endCurrentSeason();
    ctx.reply(`✔️ Season "${currentSeason.season.name}" ended successfully!`);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};