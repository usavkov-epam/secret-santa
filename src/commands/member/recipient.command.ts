import { Context } from 'telegraf';

import { participantService } from '../../services';
import { sanitizeForMarkdown } from '../../utils';

/**
 * Shows the recipient for the user.
 */
export const myRecipientHandler = async (ctx: Context) => {
  if (!ctx.from?.username) {
    return ctx.reply('❌ Could not find your username.');
  }

  try {
    const recipient = await participantService.getRecipient(ctx.from?.username);

    ctx.reply(
      `🎁 You should give a gift to *${sanitizeForMarkdown(recipient.fullName)}* \\(@\`${sanitizeForMarkdown(recipient.username)}\`\\)\\.\n\n` +
      `🎄 Hint:\n_${sanitizeForMarkdown(recipient.wish) || 'No wishlist provided.'}_\n\n` +
      `👀 More info about the person: \`${sanitizeForMarkdown(recipient.sharedLink) || 'No link provided\\.'}\``,
      {  parse_mode: 'MarkdownV2' },
    );
  } catch (error) {
    ctx.reply(`❌ ${(error as Error).message}`);
  }
};
