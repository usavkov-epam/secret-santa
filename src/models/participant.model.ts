import mongoose from 'mongoose';

import type { ParticipantDocument } from '../db';

export const ParticipantSchema = new mongoose.Schema(
  {
    telegramId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    seasonId: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
    },
    wish: {
      type: String,
      required: true,
    },
    sharedLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Adding unique index to prevent duplicates for the same season
ParticipantSchema.index({ telegramId: 1, seasonId: 1 }, { unique: true });

export const Participant = mongoose.model<ParticipantDocument>('Participant', ParticipantSchema);
