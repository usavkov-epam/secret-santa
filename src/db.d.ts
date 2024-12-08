import mongoose, { Schema, Document } from 'mongoose';

import { SeasonStatus } from './enums';

export interface Participant {
  _id: string;
  telegramId?: number;
  username?: string;
  fullName?: string;
  recipient?: Participant;
  seasonId: string;
}

export interface ParticipantDocument extends Document {
  _id: string;
  telegramId: number;
  username?: string;
  fullName: string;
  recipient?: Participant;
  seasonId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeasonDocument extends Document {
  _id: string;
  name: string;
  status: SeasonStatus;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
