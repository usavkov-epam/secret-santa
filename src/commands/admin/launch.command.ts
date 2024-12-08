import { Context } from 'telegraf';

import { commandService, currentSeasonService } from '../../services';
import { isAdmin } from '../../utils';

export const launchSeasonCommandSteps = [
  {
    step: 0,
    message: '🚀 Please provide a name of the season.',
    action: async (ctx: Context) => {
      if (!ctx.from) {
        return ctx.reply('❌ User not found');
      }

      if (!ctx.message || !('text' in ctx.message)) {
        return ctx.reply('❌ This message does not contain valid text.');
      }
    
      const seasonName = ctx.message.text.trim();
    
      try {
        await currentSeasonService.startCurrentSeason(seasonName);
        await commandService.clearState(ctx.from.id); // Clear the state after completion

        ctx.reply(`✔️ Season "${seasonName}" has been successfully launched!`);
      } catch (error) {
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  }
];

export const launchSeasonHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  const userId = ctx.from!.id; // TODO: Handle the case when ctx.from is undefined

  const state = await commandService.getState(userId);

  // If the user doesn't have a state, set it
  if (!state) {
    await commandService.setState(userId, 'launch_season');
    await ctx.reply(launchSeasonCommandSteps[0].message);
  } else {
    // If the user has a state, handle the steps
    await ctx.reply(launchSeasonCommandSteps[0].message);
  }
}

export const handleLaunchSeasonSteps = async (ctx: Context, state: any /* TODO: set type */) => {
  const currentStep = launchSeasonCommandSteps.find((step) => step.step === state.step);

  if (currentStep) {
    await currentStep.action(ctx);
  }
};
