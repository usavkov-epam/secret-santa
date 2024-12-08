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
  { timestamps: true },
);

export const Participant = mongoose.model<ParticipantDocument>('Participant', ParticipantSchema);
