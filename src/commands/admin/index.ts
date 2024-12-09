import { Telegraf } from 'telegraf';

import {
  endCurrentSeasonHandler,
  freezeCurrentSeasonHandler,
} from './current-season.command';
import {
  clearDistributionAssignment,
  distributeRecipientAssignment,
} from './distribute.command';
import { launchCurrentSeasonHandler } from './launch.command';
import { notifyParticipantsAboutAssignmentCommand } from './notify.command';
import {
  addParticipantHandler,
  removeParticipantHandler,
  listParticipantsHandler,
} from './participant.command';
import {
  createSeasonHandler,
  listSeasonsHandler,
} from './season.command';

export const registerAdminCommands = (bot: Telegraf) => {
  bot.command('create_season', createSeasonHandler);
  bot.command('launch_current_season', launchCurrentSeasonHandler);
  bot.command('freeze_current_season', freezeCurrentSeasonHandler);
  bot.command('end_current_season', endCurrentSeasonHandler);
  bot.command('add_participant', addParticipantHandler);
  bot.command('remove_participant', removeParticipantHandler);
  bot.command('list_participants', listParticipantsHandler);
  bot.command('list_seasons', listSeasonsHandler);
  bot.command('distribute_participants', distributeRecipientAssignment);
  bot.command('clear_distribution', clearDistributionAssignment);
  bot.command('notify_assignment', notifyParticipantsAboutAssignmentCommand);
};

export {
  handleLaunchSeasonSteps,
  launchSeasonCommandSteps,
} from './launch.command';