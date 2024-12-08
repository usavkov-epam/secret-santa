import {
  Context,
  Telegraf,
} from 'telegraf';
import { message } from 'telegraf/filters';

import { commandService } from '../services';
import {
  handleLaunchSeasonSteps,
  registerAdminCommands,
} from './admin';
import { cancelHandler } from './cancel.command';
import {
  handleSupportSteps,
  registerInfoCommands,
} from './info';
import {
  handleJoinSteps,
  registerMemberCommands,
} from './member';

const registerCommands = (bot: Telegraf) => {
  bot.command('cancel', cancelHandler);

  registerAdminCommands(bot);
  registerMemberCommands(bot);
  registerInfoCommands(bot);

  bot.on(message('text'), async (ctx: Context) => {
    const userId = ctx.from!.id;
    const state = await commandService.getState(userId);

    console.log('state', state);

    if (state?.command) {
      switch (state.command) {
        case 'join': {
          await handleJoinSteps(ctx, state);
          break;
        }
        case 'support': {
          await handleSupportSteps(ctx, state);
          break;
        }
        case 'launch_season': {
          await handleLaunchSeasonSteps(ctx, state);
          break;
        }
      }
    }
  });
};

export default registerCommands;
