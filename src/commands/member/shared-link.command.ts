import { Context } from 'telegraf';

import {
  commandService,
  participantService,
} from '../../services';
import { sanitizeForMarkdown } from '../../utils';

export const updateSharedLinkCommandSteps = [
  {
    step: 0,
    message: '🔗 Please send a link to your public profile',
    action: async (ctx: any) => {
      try {
        const link = ctx.message.text;

        await participantService.updateLink(ctx.from.username, link);

        ctx.reply('✔️ Your shared link has been successfully updated!');

        await commandService.clearState(ctx.from.id); // Clear the state after completion
      } catch (error) {
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
];

/**
 * Shows the user's profile link.
 */
export const myLinkHandler = async (ctx: Context) => {
  if (!ctx.from?.username) {
    return ctx.reply('❌ Could not find your username.');
  }

  try {
    const link = await participantService.getLink(ctx.from?.username);

    ctx.reply(
      `Your profile link: \`${sanitizeForMarkdown(link)}\`\\.`,
      { parse_mode: 'MarkdownV2' },
    );
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
}

export const updateSharedLinkHandler = async (ctx: Context) => {
  const userId = ctx.from!.id; // TODO: Handle the case when ctx.from is undefined

  const state = await commandService.getState(userId);

  // If the user doesn't have a state, set it
  if (!state) {
    await commandService.setState(userId, 'update_shared_link');
    await ctx.reply(updateSharedLinkCommandSteps[0].message);
  } else {
    // If the user has a state, handle the steps
    await ctx.reply(updateSharedLinkCommandSteps[0].message);
  }
}

export const handleUpdateSharedLinkSteps = async (ctx: Context, state: any /* TODO: set type */) => {
  const currentStep = updateSharedLinkCommandSteps.find((step) => step.step === state.step);

  if (currentStep) {
    await currentStep.action(ctx);
  }
};