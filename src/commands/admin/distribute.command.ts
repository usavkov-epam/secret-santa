import { Context } from 'telegraf';

import { distributionService } from '../../services';
import { isAdmin } from '../../utils';

export const distributeRecipientAssignment = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    await distributionService.distributeRecipients();

    await ctx.reply('🎉 All Secret Santa are distributed!');
  } catch (error) {
    console.error('Error distributing participants:', error);
    await ctx.reply(`❌ Error: ${(error as Error).message}`);
  }
};

export const clearDistributionAssignment = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    await distributionService.clearParticipantsDistribution();

    await ctx.reply('✔️ All Secret Santa assignments are cleared!');
  } catch (error) {
    console.error('Error clearing participants:', error);
    await ctx.reply(`❌ Error: ${(error as Error).message}`);
  }
};
