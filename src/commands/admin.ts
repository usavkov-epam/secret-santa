import { Telegraf } from 'telegraf';

import { Season } from '../models/season.model';
import { Participant } from '../models/participant.model';

export const registerAdminCommands = (bot: Telegraf) => {
  const admins = [12345678]; // Замените на ID админов

  const isAdmin = (id: number) => admins.includes(id);

  bot.command('new_season', async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
      return ctx.reply('❌ У вас нет прав на выполнение этой команды.');
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (!args[0]) {
      return ctx.reply('❌ Укажите имя сезона: /new_season <имя_сезона>');
    }

    const seasonName = args.join(' ');
    const existingSeason = await Season.findOne({ name: seasonName });

    if (existingSeason) {
      return ctx.reply('❌ Сезон с таким именем уже существует.');
    }

    const newSeason = new Season({ name: seasonName });
    await newSeason.save();
    ctx.reply(`✅ Новый сезон "${seasonName}" успешно создан!`);
  });

  bot.command('delete_season', async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
      return ctx.reply('❌ У вас нет прав на выполнение этой команды.');
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (!args[0]) {
      return ctx.reply('❌ Укажите имя сезона: /delete_season <имя_сезона>');
    }

    const seasonName = args.join(' ');
    const deletedSeason = await Season.findOneAndDelete({ name: seasonName });

    if (!deletedSeason) {
      return ctx.reply('❌ Сезон с таким именем не найден.');
    }

    ctx.reply(`✅ Сезон "${seasonName}" успешно удалён.`);
  });

  bot.command('list_seasons', async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
      return ctx.reply('❌ У вас нет прав на выполнение этой команды.');
    }

    const seasons = await Season.find();
    if (seasons.length === 0) {
      return ctx.reply('❌ Пока нет созданных сезонов.');
    }

    const seasonList = seasons.map((season) => `- ${season.name}`).join('\n');
    ctx.reply(`📋 Список сезонов:\n${seasonList}`);
  });
};
