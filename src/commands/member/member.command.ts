import { Context } from 'telegraf';

import { participantService } from '../../services';

/**
 * Joins the current season.
 */
export const joinHandler = async (ctx: Context) => {
  try {
    const participant = await participantService.joinCurrentSeason({
      telegramId: ctx.from?.id,
      username: ctx.from?.username,
    });
    ctx.reply(`You have successfully joined the season as "${participant.username}".`);
  } catch (error) {
    ctx.reply(`Error: ${(error as Error).message}`);
  }
};

/**
 * Leaves the current season.
 */
export const leaveHandler = async (ctx: Context) => {
  if (!ctx.from?.username) {
    return ctx.reply('Could not find your username.');
  }

  try {
    await participantService.leaveCurrentSeason(ctx.from?.username);
    ctx.reply('You have successfully left the current season.');
  } catch (error) {
    ctx.reply(`Error: ${(error as Error).message}`);
  }
};

/**
 * Shows the recipient for the user.
 */
export const myRecipientHandler = async (ctx: Context) => {
  if (!ctx.from?.username) {
    return ctx.reply('Could not find your username.');
  }

  try {
    const recipient = await participantService.getRecipient(ctx.from?.username);
    ctx.reply(`You should give a gift to "${recipient.username}".`);
  } catch (error) {
    ctx.reply(`Error: ${(error as Error).message}`);
  }
};
