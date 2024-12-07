import { Telegraf } from 'telegraf';

import {
  addParticipantHandler,
  removeParticipantHandler,
  listParticipantsHandler,
} from './participant.command';
import {
  createSeasonHandler,
  endSeasonHandler,
  launchSeasonHandler,
  listSeasonsHandler,
} from './season.command';

export const registerAdminCommands = (bot: Telegraf) => {
  bot.command('launch_season', launchSeasonHandler);
  bot.command('create_season', createSeasonHandler);
  bot.command('end_season', endSeasonHandler);
  bot.command('add_participant', addParticipantHandler);
  bot.command('remove_participant', removeParticipantHandler);
  bot.command('list_participants', listParticipantsHandler);
  bot.command('list_seasons', listSeasonsHandler);
};
