import mongoose, { Schema, Document } from 'mongoose';

import { SeasonStatus } from './enums';

export interface Participant {
  id: string;
  telegramId?: number;
  username?: string;
  fullName?: string;
  recipient?: Participant;
  seasonId: string;
}

export interface ParticipantDocument extends Document {
  id: string;
  telegramId: number;
  username?: string;
  fullName: string;
  recipient?: Participant;
  seasonId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeasonDocument extends Document {
  id: string;
  name: string;
  status: SeasonStatus;
  isActive: boolean;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
