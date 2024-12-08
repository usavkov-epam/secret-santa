import { Context } from 'telegraf';

import {
  commandService,
  participantService,
} from '../../services';

// Define the structure of the steps for the command
export const joinCommandSteps = [
  {
    step: 0,
    message: 'Step 1: Please provide your full name (FirstName LastName).',
    action: async (ctx: any) => {
      await commandService.updateState(ctx.from.id, {
        step: 1,
        data: { fullName: ctx.message.text },
      });
      await ctx.reply('Step 2: Please provide a link to your profile.');
    },
  },
  {
    step: 1,
    message: 'Step 2: Describe your preferences for a gift.',
    action: async (ctx: any) => {
      await commandService.updateState(ctx.from.id, {
        step: 2,
        data: { ...ctx.state.data, wish: ctx.message.text },
      });
      await ctx.reply('Step 3: Describe your preferences for a gift.');
    },
  },
  {
    step: 2,
    message: 'Step 3: Please provide a link to your profile.',
    action: async (ctx: any) => {
      console.log(ctx.state.data);

      try {
        await commandService.updateState(ctx.from.id, {
          step: 3,
          data: { ...ctx.state.data, sharedLink: ctx.message.text },
        });

        const participant = await participantService.joinCurrentSeason({
          telegramId: ctx.from?.id,
          username: ctx.from?.username,
          fullName: `${ctx.from?.first_name} ${ctx.from?.last_name}`.trim(),
        });

        await commandService.clearState(ctx.from.id); // Clear the state after completion

        ctx.reply(`🎉 You have successfully joined the season as "${participant.fullName} (${participant.username})".`);
      } catch (error) {
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
];

/**
 * Joins the current season.
 */
export const joinHandler = async (ctx: Context) => {
  if (await participantService.checkIfParticipantExists(ctx.from!.username as string)) {
    return ctx.reply('❌ You have already joined the season.');
  }

  const userId = ctx.from!.id; // TODO: Handle the case when ctx.from is undefined

  const state = await commandService.getState(userId);

  // If the user doesn't have a state, set it
  if (!state) {
    await commandService.setState(userId, 'join');
    await ctx.reply(joinCommandSteps[0].message);
  } else {
    // If the user has a state, handle the steps
  await handleJoinSteps(ctx, state);
  }
};

export const handleJoinSteps = async (ctx: Context, state: any /* TODO: set type */) => {
  const currentStep = joinCommandSteps.find((step) => step.step === state.step);

  if (currentStep) {
    await currentStep.action(ctx);
  }
};