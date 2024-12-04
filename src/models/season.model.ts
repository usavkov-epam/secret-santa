import mongoose from 'mongoose';
import { ParticipantSchema } from './participant.model';

const SeasonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [ParticipantSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Season = mongoose.model('Season', SeasonSchema);
