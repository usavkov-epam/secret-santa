import { Schema, model, Document } from 'mongoose';

interface ICommandStep extends Document {
  userId: number;
  command: string;
  step: number;
  data: Record<string, any>;
}

const commandStepSchema = new Schema<ICommandStep>({
  userId: { type: Number, required: true, unique: true },
  command: { type: String, required: true },
  step: { type: Number, default: 0 },
  data: { type: Object, default: {} },
});

export const CommandStep = model<ICommandStep>('CommandStep', commandStepSchema);
