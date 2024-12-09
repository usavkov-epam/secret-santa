import { Context } from 'telegraf';

import { commandService } from '../../services';

const SUPPORT_TELEGRAM_ID = process.env.SUPPORT_TELEGRAM_ID!;

export const supportCommandSteps = [
  {
    step: 0,
    message: '🧑‍💻 Please provide a message for support team.',
    action: async (ctx: any) => {
      try {
        await ctx.telegram.sendMessage(
          SUPPORT_TELEGRAM_ID,
          `🆘 Support request from ${ctx.from?.first_name} ${ctx.from?.last_name} (${ctx.from?.username}: ${ctx.from?.id}):\n${(ctx.message as any)?.text}`,
        );

        await commandService.clearState(ctx.from.id); // Clear the state after completion
      } catch (error) {
        ctx.reply(`❌ ${(error as Error).message}`);
      }
    },
  },
];

export const supportHandler = async (ctx: Context) => {
  const userId = ctx.from!.id; // TODO: Handle the case when ctx.from is undefined

  const state = await commandService.getState(userId);

  // If the user doesn't have a state, set it
  if (!state) {
    await commandService.setState(userId, 'support');
    await ctx.reply(supportCommandSteps[0].message);
  } else {
    // If the user has a state, handle the steps
    await ctx.reply(supportCommandSteps[0].message);
  }
};

export const handleSupportSteps = async (ctx: Context, state: any /* TODO: set type */) => {
  const currentStep = supportCommandSteps.find((step) => step.step === state.step);

  if (currentStep) {
    await currentStep.action(ctx);
  }
};
