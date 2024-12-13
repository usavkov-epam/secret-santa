import { Context } from 'telegraf';

import {
  commandService,
  currentSeasonService,
  participantService,
} from '../../services';
import { ParticipantJoinData } from '../../types';
import { sanitizeForMarkdown } from '../../utils';

// Define the structure of the steps for the command
export const joinCommandSteps = [
  {
    step: 0,
    message: 'Step 1: Please provide your full name (FirstName LastName).',
    action: async (ctx: any) => {
      console.log('fullName', ctx.message?.text, ctx.from?.id, ctx.from?.username);

      try {
        const currentState = await commandService.getState(ctx.from.id);
        const updatedData = { ...currentState?.data, fullName: ctx.message.text };

        await commandService.updateState(ctx.from.id, {
          step: 1,
          data: updatedData,
        });
        await ctx.reply(joinCommandSteps[1].message);
      } catch (error) {
        console.log('error', error);
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
  {
    step: 1,
    message: 'Step 2: Describe your preferences for a gift.',
    action: async (ctx: any) => {
      console.log('wish', ctx.message?.text, ctx.from?.id, ctx.from?.username);

      try {
        const currentState = await commandService.getState(ctx.from.id);
        const updatedData = { ...currentState?.data, wish: ctx.message.text };

        await commandService.updateState(ctx.from.id, {
          step: 2,
          data: updatedData,
        });
        await ctx.reply(joinCommandSteps[2].message);
      } catch (error) {
        console.log('error', error);
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
  {
    step: 2,
    message:
      'Step 3: Please provide a link to your profile which help Secret Santa to get your lifestyle (e.g. Instagram, Facebook, etc.). Or /empty',
    action: async (ctx: any) => {
      console.log('sharedLink', ctx.message?.text, ctx.from?.id, ctx.from?.username);

      const currentState = await commandService.getState(ctx.from.id);
      const updatedData = {
        ...currentState?.data,
        sharedLink: ctx.message.text,
      } as ParticipantJoinData;

      try {
        await commandService.updateState(ctx.from.id, {
          step: 3,
          data: updatedData,
        });

        const participant = await participantService.joinCurrentSeason(
          {
            telegramId: ctx.from?.id,
            username: ctx.from?.username,
            first_name: ctx.from?.first_name,
            last_name: ctx.from?.last_name,
          },
          updatedData,
        );

        await commandService.clearState(ctx.from.id); // Clear the state after completion

        ctx.reply(
          `🎉 You have successfully joined the season as *${sanitizeForMarkdown(participant.fullName)}*\\.`,
          { parse_mode: 'MarkdownV2' },
        );
      } catch (error) {
        console.log('error', error);
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
];

/**
 * Joins the current season.
 */
export const joinHandler = async (ctx: Context) => {
  console.log('from', ctx.from, ctx.from?.id, ctx.from?.username);

  try {
    if (!(await currentSeasonService.getCurrentSeason())) {
      return ctx.reply('❌ No active season found.');
    }

    if (await participantService.checkIfParticipantExists(ctx.from!.username as string)) {
      return ctx.reply('❌ You have already joined the season.');
    }

    const userId = ctx.from!.id; // TODO: Handle the case when ctx.from is undefined

    const state = await commandService.getState(userId);

    // If the user doesn't have a state, set it
    if (!state) {
      await commandService.setState(userId, 'join');
      await ctx.reply(sanitizeForMarkdown(joinCommandSteps[0].message), {
        parse_mode: 'MarkdownV2',
      });
    } else {
      // If the user has a state, handle the steps
      await ctx.reply(sanitizeForMarkdown(joinCommandSteps[state.step].message), {
        parse_mode: 'MarkdownV2',
      });
    }
  } catch (error) {
    console.log('error', error);
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};

export const handleJoinSteps = async (ctx: Context, state: any /* TODO: set type */) => {
  const currentStep = joinCommandSteps.find((step) => step.step === state.step);

  if (currentStep) {
    await currentStep.action(ctx);
  }
};
