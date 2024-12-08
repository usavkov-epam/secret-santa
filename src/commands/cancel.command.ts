import { Context } from 'telegraf';

import { commandService } from '../services';

export const cancelHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;

  if (userId) {
    await commandService.clearState(userId);
    await ctx.reply('✔️ The current process has been canceled. You can start a new command anytime.');
  }
};