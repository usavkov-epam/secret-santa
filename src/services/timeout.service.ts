import { Context } from 'telegraf';

import { commandService } from './command.service';

const activeTimeouts: Map<number, NodeJS.Timeout> = new Map();

/**
 * Sets a timeout for a user.
 * @param userId The user's ID.
 * @param timeout Timeout duration in seconds.
 * @param ctx Telegraf context.
 */
export function setTimeoutForUser(userId: number, timeout: number, ctx: Context): void {
  const timer = setTimeout(async () => {
    await commandService.clearState(userId);
    activeTimeouts.delete(userId);
    await ctx.reply('You did not respond in time. The command has been canceled.');
  }, timeout * 1000);

  activeTimeouts.set(userId, timer);
}

/**
 * Clears an active timeout for a user.
 * @param userId The user's ID.
 */
export function clearTimeoutForUser(userId: number): void {
  if (activeTimeouts.has(userId)) {
    clearTimeout(activeTimeouts.get(userId));
    activeTimeouts.delete(userId);
  }
}
