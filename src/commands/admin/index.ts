import { Telegraf } from 'telegraf';

import { distributeRecipientAssignment } from './distribute.command';
import { launchSeasonHandler } from './launch.command';
import { notifyParticipantsAboutAssignmentCommand } from './notify.command';
import {
  addParticipantHandler,
  removeParticipantHandler,
  listParticipantsHandler,
} from './participant.command';
import {
  createSeasonHandler,
  endSeasonHandler,
  freezeSeasonHandler,
  listSeasonsHandler,
} from './season.command';

export const registerAdminCommands = (bot: Telegraf) => {
  bot.command('create_season', createSeasonHandler);
  bot.command('launch_season', launchSeasonHandler);
  bot.command('freeze_season', freezeSeasonHandler);
  bot.command('end_season', endSeasonHandler);
  bot.command('add_participant', addParticipantHandler);
  bot.command('remove_participant', removeParticipantHandler);
  bot.command('list_participants', listParticipantsHandler);
  bot.command('list_seasons', listSeasonsHandler);
  bot.command('distribute_participants', distributeRecipientAssignment);
  bot.command('notify_assignment', notifyParticipantsAboutAssignmentCommand);
};

export {
  handleLaunchSeasonSteps,
  launchSeasonCommandSteps,
} from './launch.command';