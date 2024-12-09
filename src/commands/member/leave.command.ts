import { Context } from 'telegraf';

import { participantService } from '../../services';


/**
 * Leaves the current season.
 */
export const leaveHandler = async (ctx: Context) => {
  if (!ctx.from?.username) {
    return ctx.reply('❌ Could not find your username.');
  }

  try {
    await participantService.leaveCurrentSeason(ctx.from?.username);
    ctx.reply('✔️ You have successfully left the current season 😢');
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};