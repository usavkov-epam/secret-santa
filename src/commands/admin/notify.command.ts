import { Context } from 'telegraf';

import { Participant } from '../../models';
import {
  currentSeasonService,
  participantService,
} from '../../services';
import { sanitizeForMarkdown } from '../../utils';

export const notifyParticipantsAboutAssignmentCommand = async (ctx: Context) => {
  const currentSeason = await currentSeasonService.getCurrentSeason();
  const seasonId = currentSeason.season._id;

  try {
    const participants = await Participant.find({ seasonId });

    for (const participant of participants) {
      if (!participant.username) {
        console.warn(`Participant ${participant._id} has no username. Skipping...`);
        continue;
      }

      const recipient = await participantService.getRecipient(participant.username);

      const message =
        `🎅 Hello, ${sanitizeForMarkdown(participant.fullName)}\\!\n\n` +
        '🎁 You are the Secret Santa for:\n' +
        `*${sanitizeForMarkdown(recipient?.fullName)}* \\(@\`${sanitizeForMarkdown(recipient?.username) ?? 'No username'}\`\\)\n\n` +
        `📝 Here's the hint for a present:\n_${sanitizeForMarkdown(recipient?.wish) ?? 'No wishlist provided.'}_\n\n` +
        `👀 More info about the person: \`${sanitizeForMarkdown(recipient?.sharedLink) ?? 'No link provided.'}\`\n\n` +
        '🎄 Happy gifting\\! 🎄';

      try {
        await ctx.telegram.sendMessage(participant.telegramId, message, {
          parse_mode: 'MarkdownV2',
        });
      } catch (error) {
        console.error(`❌ Failed to notify participant ${participant.telegramId}:`, error);
      }
    }

    await ctx.reply('🎉 Notifications have been sent to all participants!');
  } catch (error) {
    console.error('Error notifying participants:', error);
    await ctx.reply(`❌ Error: ${(error as Error).message}`);
  }
};

export const notifyParticipantsAboutDeliveryCommand = async (ctx: Context) => {
  const currentSeason = await currentSeasonService.getCurrentSeason();
  const seasonId = currentSeason.season._id;

  try {
    const participants = await Participant.find({ seasonId });

    const message = `
      Hey, Santa\\! 🎅

The big day for the gift delivery and unwrapping is almost here\\! Here’s what you need to know for *December 27th*:

  • Don’t forget to clearly write your Santee’s name on the gift – we don’t want any mix\\-ups\\!
  • Drop off your gift at the office \\(*1 Suliko Zgenti street, room 401 Kelitsadi*\\) between *5:00 PM on the 26th* and *12:00 PM on the 27th* – Santa is on a schedule\\! ☺️🦌
  • Get ready to unwrap and celebrate at *3:00 PM* with hot cocoa, tea, and cookies\\!✨

We can’t wait to see all the holiday magic you’ll bring\\! 🎁🪄
`;
    
for (const participant of participants) {
  if (!participant.username) {
    console.warn(`Participant ${participant._id} has no username. Skipping...`);
    continue;
  }

  try {
    await ctx.telegram.sendMessage(participant.telegramId, message, {
      parse_mode: 'MarkdownV2',
    });
  } catch (error) {
    console.error(`❌ Failed to notify participant ${participant.telegramId}:`, error);
  }
}

    await ctx.reply('🎉 Notifications have been sent to all participants!');
  } catch (error) {
    console.error('Error notifying participants:', error);
    await ctx.reply(`❌ Error: ${(error as Error).message}`);
  }
};
