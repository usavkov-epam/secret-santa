import type { SeasonDocument } from '../db';
import {
  Participant as ParticipantModel,
  Season as SeasonModel,
} from '../models';

class SeasonService {
  /**
   * Creates a new season.
   * @param name - The name of the season.
   * @param endDate - The end date of the season.
   */
  async createSeason(name: string, endDate?: Date): Promise<SeasonDocument> {
    const existingActiveSeason = await SeasonModel.findOne({ isActive: true });

    if (existingActiveSeason) {
      throw new Error('An active season already exists. End it before starting a new one.');
    }

    const season = new SeasonModel({
      name,
      endDate: endDate || null,
      isActive: true,
      participants: [],
    });

    return await season.save();
  }

  /**
   * Ends the current active season.
   */
  async endCurrentSeason(): Promise<SeasonDocument> {
    const currentSeason = await SeasonModel.findOne({ isActive: true });

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    currentSeason.isActive = false;

    return await currentSeason.save();
  }

  /**
   * Retrieves all seasons.
   */
  async getAllSeasons(): Promise<SeasonDocument[]> {
    return await SeasonModel.find().sort({ createdAt: -1 });
  }

  /**
   * Retrieves the current active season.
   */
  async getCurrentSeason(): Promise<SeasonDocument> {
    const currentSeason = await SeasonModel.findOne({ isActive: true });

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    return currentSeason;
  }

  /**
   * Retrieves the status of the current active season.
   */
  async getCurrentSeasonStatus(): Promise<string> {
    const currentSeason = await this.getCurrentSeason();

    const participants = await ParticipantModel.find({ seasonId: currentSeason.id });

    return `Season: ${currentSeason.name}\nParticipants: ${participants.length}\nEnd Date: ${
      currentSeason.endDate ? currentSeason.endDate.toISOString() : 'Not set'
    }`;
  }
}

export const seasonService = new SeasonService();
