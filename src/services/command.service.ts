import { CommandStep } from '../models';

class CommandService {
  async getState(userId: number) {
    return await CommandStep.findOne({ userId }).exec();
  }

  async setState(userId: number, command: string) {
    await CommandStep.findOneAndUpdate(
      { userId },
      { userId, command, step: 0, data: {} },
      { upsert: true, new: true }
    );
  }

  async updateState(userId: number, updates: Partial<{ step: number; data: Record<string, any> }>) {
    console.log('updates', updates);
    await CommandStep.findOneAndUpdate({ userId }, { $set: updates }).exec();
  }

  async clearState(userId: number) {
    await CommandStep.findOneAndDelete({ userId }).exec();
  }
}

export const commandService = new CommandService();
