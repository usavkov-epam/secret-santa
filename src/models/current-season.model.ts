import { Schema, Types, model } from 'mongoose';

import { SeasonDocument } from '../db';

interface ICurrentSeason {
  season: SeasonDocument
}

interface CurrentSeasonDocument extends ICurrentSeason, Document {}

// Define schema for current season
const CurrentSeasonSchema = new Schema(
  {
    season: {
      type: Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
  },
  { timestamps: true },
);

// Export model
export const CurrentSeason = model<CurrentSeasonDocument>('CurrentSeason', CurrentSeasonSchema);
