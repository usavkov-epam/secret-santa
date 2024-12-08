import { Context } from 'telegraf';

import { commandService } from '../services';

export const cancelHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;

  if (userId) {
    const currentState = await commandService.getState(userId);

    if (currentState) {
      await commandService.clearState(userId);
      await ctx.reply('✔️ The current process has been canceled. You can start a new command anytime.');
    } else {
      await ctx.reply('👀 No active command to cancel.');
    }
  }
};