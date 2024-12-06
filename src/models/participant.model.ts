import mongoose from 'mongoose';
import type { ParticipantDocument } from '../db';

export const ParticipantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
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
  },
  { timestamps: true },
);

export const Participant = mongoose.model<ParticipantDocument>('Participant', ParticipantSchema);
