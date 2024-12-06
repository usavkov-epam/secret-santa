import { Telegraf } from 'telegraf';

import {
  addParticipantHandler,
  removeParticipantHandler,
  listParticipantsHandler,
} from './participant.command';
import {
  startSeasonHandler,
  endSeasonHandler,
  listSeasonsHandler,
} from './season.command';

export const registerAdminCommands = (bot: Telegraf) => {
  bot.command('launch', startSeasonHandler);
  bot.command('endseason', endSeasonHandler);
  bot.command('addparticipant', addParticipantHandler);
  bot.command('removeparticipant', removeParticipantHandler);
  bot.command('listparticipants', listParticipantsHandler);
  bot.command('listseasons', listSeasonsHandler);
};
