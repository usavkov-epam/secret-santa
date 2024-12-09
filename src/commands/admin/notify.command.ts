import { Context } from 'telegraf';

import { Participant } from '../../models';
import {
  currentSeasonService,
  participantService,
} from '../../services';

export const notifyParticipantsAboutAssignmentCommand = async (ctx: Context) => {
  const currentSeason = await currentSeasonService.getCurrentSeason();
  const seasonId = currentSeason.season._id;

  try {
    const participants = await Participant.find({ seasonId });

    for (const participant of participants) {
      if (!participant.username) {
        console.warn(`Participant ${participant._id} has no username. Skipping...`);
        continue
      }

      const recipient = await participantService.getRecipient(participant.username);

      const message = (
        `🎅 Hello, ${participant.fullName}!\n\n` +
        'You are the Secret Santa for:\n' +
        `🎁 *${recipient?.fullName}* (@\`${recipient?.username ?? 'No username'}\`)\n\n` +

        `Here's the hint for a present:\n_${recipient?.wish ?? 'No wishlist provided.'}_\n\n` +
        `More info about the person: \`${recipient?.sharedLink ?? 'No link provided.'}\`\n\n` +

        '🎄 Happy gifting! 🎄'
      );

      try {
        await ctx.telegram.sendMessage(participant.telegramId, message, { parse_mode: 'Markdown' });
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
