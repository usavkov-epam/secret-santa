import { Context } from 'telegraf';

import { participantService } from '../../services';
import { isAdmin } from '../../utils';

/**
 * Adds a participant to the current season.
 */
export const addParticipantHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  const { message } = ctx;

  if (message && 'text' in message) {
    const args = message.text.split(' ').slice(1);

    if (args.length === 0) {
      return ctx.reply('Usage: /addparticipant <username>. Example: /addparticipant @john');
    }

    const username = args[0];

    try {
      const participant = await participantService.addParticipantToCurrentSeason({ username }, );
      ctx.reply(`Participant "${participant.username}" added to the current season.`);
    } catch (error) {
      ctx.reply(`❌ ${(error as Error).message}`);
    }
  }
};

/**
 * Removes a participant from the current season.
 */
export const removeParticipantHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  const { message } = ctx;

  if (message && 'text' in message) {
    const args = message.text.split(' ').slice(1);

    if (args.length === 0) {
      return ctx.reply('Usage: /removeparticipant <username>. Example: /removeparticipant @john');
    }
    const username = args[0];

    try {
      await participantService.removeParticipantFromCurrentSeason(username);
      ctx.reply(`Participant "${username}" removed from the current season.`);
    } catch (error) {
      ctx.reply(`❌ ${(error as Error).message}`);
    }
  }
};

/**
 * Lists all participants of the current season.
 */
export const listParticipantsHandler = async (ctx: Context) => {
  if (!isAdmin(ctx.from?.id)) {
    return ctx.reply('❌ You do not have permission to execute this command.');
  }

  try {
    const participants = await participantService.getParticipantsForCurrentSeason();
    if (participants.length === 0) {
      return ctx.reply('❕No participants in the current season.');
    }

    const list = participants.map((p) => `- ${p.fullName} (${p.username})`).join('\n');

    ctx.reply(`Participants:\n${list}`);
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};
