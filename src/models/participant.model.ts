import mongoose from 'mongoose';

export const ParticipantSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true },
  username: { type: String, required: true },
  fullName: { type: String, required: true },
});

export const Participant = mongoose.model('Participant', ParticipantSchema);
