import { Telegraf } from 'telegraf';

import { Season } from '../models/season.model';

export const registerUserCommands = (bot: Telegraf) => {
  bot.command('join', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (!args[0]) {
      return ctx.reply('❌ Укажите имя сезона: /join <имя_сезона>');
    }

    const seasonName = args.join(' ');
    const season = await Season.findOne({ name: seasonName });

    if (!season) {
      return ctx.reply('❌ Сезон с таким именем не найден.');
    }

    const { id, username, first_name, last_name } = ctx.from;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    if (season.participants.some((p) => p.telegramId === id)) {
      return ctx.reply('❌ Вы уже участвуете в этом сезоне.');
    }

    season.participants.push({ telegramId: id, username: username || 'unknown', fullName });
    await season.save();

    ctx.reply(`✅ Вы успешно присоединились к сезону "${seasonName}".`);
  });

  bot.command('cancel', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (!args[0]) {
      return ctx.reply('❌ Укажите имя сезона: /cancel <имя_сезона>');
    }

    const seasonName = args.join(' ');
    const season = await Season.findOne({ name: seasonName });

    if (!season) {
      return ctx.reply('❌ Сезон с таким именем не найден.');
    }

    const participantIndex = season.participants.findIndex((p) => p.telegramId === ctx.from.id);
    if (participantIndex === -1) {
      return ctx.reply('❌ Вы не участвуете в этом сезоне.');
    }

    season.participants.splice(participantIndex, 1);
    await season.save();

    ctx.reply(`✅ Ваше участие в сезоне "${seasonName}" успешно отменено.`);
  });
};
