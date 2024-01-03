const { bold, Events } = require("discord.js");
const { UserXp } = require("../db-objects.js");
const { level } = require("../utils/leveling.js");

const XP_PER_MESSAGE = 10;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
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

      if (oldLvl !== newLvl) {
        message.reply({
          content: `You have leveled up to ${userLevelText}!`,
          ephemeral: true,
        });
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
