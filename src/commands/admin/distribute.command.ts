import { Context } from 'telegraf';

import { distributionService } from '../../services';

export const distributeRecipientAssignment = async (ctx: Context) => {
  try {
    await distributionService.distributeRecipients();

    await ctx.reply('🎉 All Secret Santa are distributed!');
  } catch (error) {
    console.error('Error distributing participants:', error);
    await ctx.reply(`❌ Error: ${(error as Error).message}`);
  }
};
