import { Context } from 'telegraf';

import { commandService, participantService } from '../../services';

export const updateWishCommandSteps = [
  {
    step: 0,
    message: '✍️ Please describe your wish',
    action: async (ctx: any) => {
      try {
        const wish = ctx.message.text;

        await participantService.updateWish(ctx.from.username, wish);

        ctx.reply('✔️ Your wish has been successfully updated!');

        await commandService.clearState(ctx.from.id); // Clear the state after completion
      } catch (error) {
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
];

/**
 * Shows the user's wish.
 */
export const myWishHandler = async (ctx: Context) => {
  if (!ctx.from?.username) {
    return ctx.reply('❌ Could not find your username.');
  }

  try {
    const wish = await participantService.getWish(ctx.from?.username);

    ctx.reply(
      `Your wish:\n"_${wish}_".`,
      { parse_mode: 'Markdown' },
    );
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
}

export const updateWishHandler = async (ctx: Context) => {
  const userId = ctx.from!.id; // TODO: Handle the case when ctx.from is undefined

  const state = await commandService.getState(userId);

  // If the user doesn't have a state, set it
  if (!state) {
    await commandService.setState(userId, 'update_wish');
    await ctx.reply(updateWishCommandSteps[0].message);
  } else {
    // If the user has a state, handle the steps
    await ctx.reply(updateWishCommandSteps[0].message);
  }
}

export const handleUpdateWishSteps = async (ctx: Context, state: any /* TODO: set type */) => {
  const currentStep = updateWishCommandSteps.find((step) => step.step === state.step);

  if (currentStep) {
    await currentStep.action(ctx);
  }
};