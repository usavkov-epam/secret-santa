import { Telegraf } from 'telegraf';

import { registerAdminCommands } from './admin';
import { registerUserCommands } from './user';

const registerCommands = (bot: Telegraf) => {
  registerAdminCommands(bot);
  registerUserCommands(bot);
};

export default registerCommands;
