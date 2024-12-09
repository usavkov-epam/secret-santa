import type {
  Participant,
  ParticipantDocument,
} from '../db';
import { SeasonStatus } from '../enums';
import { Participant as ParticipantModel } from '../models';
import { currentSeasonService } from './current-season.service';

export class DistributionService {
  /**
   * Distributes unique recipients among participants for a given season.
   * Each participant will gift the next, and the last participant will gift the first.
   * 
   * @param seasonId - The ID of the current season.
   */
  async distributeRecipients(): Promise<void> {
    const currentSeason = await currentSeasonService.getCurrentSeason();
    const seasonId = currentSeason.season._id;

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    if (currentSeason.season.status !== SeasonStatus.Frozen) {
      throw new Error('Season must be frozen before distributing participants.');
    }

    const participants = await ParticipantModel.find({ seasonId });

    if (participants.length < 2) {
      throw new Error('At least two participants are required for distribution.');
    }

    // Step 1: Shuffle participants
    const shuffled = this.shuffleParticipants(participants);

    console.group('---')
    // Step 2: Assign recipients
    for (let i = 0; i < shuffled.length; i++) {
      const currentParticipant = shuffled[i];
      const recipient = shuffled[(i + 1) % shuffled.length]; // Next participant, last one gets first

      console.log([currentParticipant.username, recipient.username]);

      // Step 3: Update each participant with the assigned recipient
      await ParticipantModel.updateOne(
        { _id: currentParticipant._id },
        { $set: { recipient: recipient._id } }
      );
    }
    console.groupEnd();
  }

  /**
   * Shuffles the participants randomly.
   * 
   * @param participants - The list of participants to shuffle.
   * @returns - A shuffled list of participants.
   */
  private shuffleParticipants(participants: ParticipantDocument[]): Participant[] {
    // Randomly shuffle array
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    return participants;
  }
}

export const distributionService = new DistributionService();
