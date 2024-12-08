import type { SeasonDocument } from '../db';
import { SeasonStatus } from '../enums';
import { Season as SeasonModel } from '../models';

class SeasonService {
  /**
   * Creates a new season.
   * @param name - The name of the season.
   * @param endDate - The end date of the season.
   */
  async createSeason(name: string, endDate?: Date): Promise<SeasonDocument> {
    const existingActiveSeason = await SeasonModel.findOne({ status: SeasonStatus.Active });

    if (existingActiveSeason) {
      throw new Error('❌ An active season already exists. End it before starting a new one.');
    }

    const season = new SeasonModel({
      name,
      endDate: endDate || null,
      status: SeasonStatus.NotStarted,
      participants: [],
    });

    console.log(season);

    return await season.save();
  }

  /*
   * Update season status 
   */
  async updateSeasonStatus(seasonId: string, status: SeasonStatus): Promise<SeasonDocument> {
    const season = await SeasonModel.findById(seasonId);

    if (!season) {
      throw new Error('❌ Season not found.');
    }

    season.status = status;

    return await season.save();
  }

  /**
   * Retrieves all seasons.
   */
  async getAllSeasons(): Promise<SeasonDocument[]> {
    return await SeasonModel.find().sort({ createdAt: -1 });
  }
}

export const seasonService = new SeasonService();
