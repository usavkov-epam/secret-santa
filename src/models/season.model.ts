import mongoose from 'mongoose';

import type { SeasonDocument } from '../db';

import { SeasonStatus } from '../enums';

const SeasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        SeasonStatus.NotStarted,
        SeasonStatus.Active,
        SeasonStatus.Frozen,
        SeasonStatus.Ended,
      ],
      default: SeasonStatus.NotStarted,
    },
    endDate: { type: Date },
  },
  { timestamps: true },
);

export const Season = mongoose.model<SeasonDocument>('Season', SeasonSchema);
