import { SeasonDocument } from '../db';
import { SeasonStatus } from '../enums';
import {
  CurrentSeason,
  Participant,
  Season,
} from '../models';
import { seasonService } from '../services';

class CurrentSeasonService {
  /**
   * Creates a new current season.
   * @param name - The name of the season.
   */
  async startCurrentSeason(name: string) {
    const isExistingOne = await CurrentSeason.findOne();

    if (isExistingOne) {
      throw new Error('Current season already exists.');
    }

    const season = await Season.findOne({ name });

    if (!season) {
      throw new Error('Season not found.');
    }

    const updated = await CurrentSeason.updateOne(
      {},
      { season: season._id },
      { upsert: true }
    );

    await seasonService.updateSeasonStatus(season._id, SeasonStatus.Active);

    return updated;
  }

  /**
   * Freezes the current active season.
   */
  async freezeCurrentSeason(): Promise<SeasonDocument> {
    const currentSeason = await this.getCurrentSeason();


    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    return await seasonService.updateSeasonStatus(currentSeason.season._id, SeasonStatus.Frozen);
  }

  /**
   * Ends the current active season.
   */
  async endCurrentSeason(): Promise<any> {
    const currentSeason = await this.getCurrentSeason();
    const season = await Season.findById(currentSeason.season._id);

    if (!currentSeason) {
      throw new Error('No active season found.');
    }

    if (!season) {
      throw new Error('Season not found.');
    }

    await seasonService.updateSeasonStatus(season._id, SeasonStatus.Ended);
    await this.removeCurrentSeason();

    return;
  }

  // Get the current season
  async getCurrentSeason() {
    const currentSeason = await CurrentSeason.findOne().populate('season');

    if (!currentSeason) {
      throw new Error('No current season found.');
    }

    return currentSeason;
  }

  /*
    * Remove the current season 
   */
  removeCurrentSeason() {
    return CurrentSeason.deleteMany();
  }
  
  /**
   * Retrieves the status of the current active season.
   */
  async getCurrentSeasonStatus(): Promise<string> {
    const currentSeason = await this.getCurrentSeason();

    if (!currentSeason) {
      throw new Error('❌ No active season found.');
    }

    const participants = await Participant.find({ seasonId: currentSeason.season._id });

    return `Season: ${currentSeason.season.name}\nParticipants: ${participants.length}\nStatus: ${currentSeason.season.status}\nEnd Date: ${
      currentSeason.season.endDate ? currentSeason.season.endDate.toISOString() : 'Not set'
    }`;
  }
}

export const currentSeasonService = new CurrentSeasonService();
