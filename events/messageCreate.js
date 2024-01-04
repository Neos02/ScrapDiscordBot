const { bold, roleMention, Events } = require("discord.js");
const { UserXp, LevelRoles } = require("../db-objects.js");
const { level } = require("../utils/leveling.js");

const XP_PER_MESSAGE = 10;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const userXp = await UserXp.findOne({
      where: {
        guild: message.guildId,
        user: message.author.id,
      },
    });

    if (userXp) {
      const oldLvl = level(userXp.xp);

      userXp.xp += XP_PER_MESSAGE;

      const newLvl = level(userXp.xp);
      const userLevelText = bold(`Level ${newLvl}`);

      const levelRole = (
        await LevelRoles.findAll({
          where: { guild: message.guild.id },
        })
      ).filter((x) => x.level === newLvl);

      if (oldLvl !== newLvl) {
        if (levelRole.length) {
          const guild = message.client.guilds.cache.get(message.guild.id);
          const member = await guild.members.cache.get(message.author.id);

          member.roles.add(levelRole[0].role).catch(console.error);

          message.reply(
            `You have leveled up to ${userLevelText} and earned the role ${roleMention(
              levelRole[0].role
            )}!`
          );
        } else {
          message.reply(`You have leveled up to ${userLevelText}!`);
        }
      }

      return userXp.save();
    }

    return UserXp.create({
      user: message.author.id,
      guild: message.guild.id,
      xp: XP_PER_MESSAGE,
    });
  },
};
