import { Telegraf } from 'telegraf';

import { registerAdminCommands } from './admin';
import { registerMemberCommands } from './member';
import { registerInfoCommands } from './info';

const registerCommands = (bot: Telegraf) => {
  registerAdminCommands(bot);
  registerMemberCommands(bot);
  registerInfoCommands(bot);
};

export default registerCommands;
