import type {
  ParticipantJoinData,
  TelegramUser,
} from '../types';

import { Participant } from '../db';
import { SeasonStatus } from '../enums';
import { Participant as ParticipantModel } from '../models';
import { currentSeasonService } from '../services';

class ParticipantService {
  /**
   * Adds a participant to the current active season.
   */
  async addParticipantToCurrentSeason(data: Pick<Participant, 'username'>): Promise<Participant> {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    const alreadyExists = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username: data.username,
    });

    if (alreadyExists) {
      throw new Error(`Participant is already in the season.`);
    }

    const participant = await ParticipantModel.create({
      ...data,
      seasonId: currentSeason.season._id,
    });

    await participant.save();

    return participant;
  }

  /**
   * Removes a participant from the current active season.
   * @param username - The username of the participant.
   */
  async removeParticipantFromCurrentSeason(username: string): Promise<void> {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('Participant not found.');
    }

    await participant.deleteOne();
  }

  /**
   * Gets all participants of the current active season.
   */
  async getParticipantsForCurrentSeason() {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    if (currentSeason.season.status === SeasonStatus.Frozen) {
      throw new Error('Secret Santa registration has ended.');
    }

    const allParticipants = await ParticipantModel.find({ seasonId: currentSeason.season._id });

    return allParticipants;
  }

  /**
   * Adds the current user to the current season.
   */
  async joinCurrentSeason(telegramUser: TelegramUser, data: ParticipantJoinData) {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    if (currentSeason.season.status === SeasonStatus.Frozen) {
      throw new Error('Secret Santa registration has ended.');
    }

    const alreadyExists = await ParticipantModel.exists({
      seasonId: currentSeason.season._id,
      username: telegramUser.username,
    });

    if (alreadyExists) {
      throw new Error('You are already part of the current season.');
    }

    const participant = await ParticipantModel.create({
      ...telegramUser,
      ...data,
      seasonId: currentSeason.season._id,
    });

    await participant.save();

    return participant;
  }

  /**
   * Removes the current user from the current season.
   * @param username - Telegram username.
   */
  async leaveCurrentSeason(username: string): Promise<void> {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('You are not part of the current season.');
    }

    if (participant.recipient) {
      throw new Error('You cannot leave the season after the recipient assignment has been completed.');
    }

    await participant.deleteOne();
  }

  /**
   * Gets the recipient assigned to the current user.
   * @param username - Telegram username.
   */
  async getRecipient(username: string) {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('You are not part of the current season.');
    }

    if (!participant.recipient) {
      throw new Error('Recipient assignment has not been completed yet.');
    }

    return participant.recipient;
  }

  async checkIfParticipantExists(username: string) {
    return ParticipantModel.exists({ username });
  }

  /*
   * Get wish by username 
   */
  async getWish(username: string) {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('Participant not found.');
    }

    return participant.wish;
  }

  /*
   * Update wish by username
  */
  async updateWish(username: string, wish: string) {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    if (currentSeason.season.status === SeasonStatus.Frozen) {
      throw new Error('Secret Santa registration has ended and the draw stage began.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('Participant not found.');
    }

    participant.wish = wish;

    await participant.save();

    return participant;
  }

  /**
   * Get link by username
   */
  async getLink(username: string) {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('Participant not found.');
    }

    return participant.sharedLink;
  }

  /**
   * Update link by username
   */
  async updateLink(username: string, link: string) {
    const currentSeason = await currentSeasonService.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    if (currentSeason.season.status === SeasonStatus.Frozen) {
      throw new Error('Secret Santa registration has ended and the draw stage began.');
    }

    const participant = await ParticipantModel.findOne({
      seasonId: currentSeason.season._id,
      username,
    });

    if (!participant) {
      throw new Error('Participant not found.');
    }

    participant.sharedLink = link;

    await participant.save();

    return participant;
  }
}

export const participantService = new ParticipantService();
