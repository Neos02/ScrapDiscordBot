const { bold, roleMention, Events } = require("discord.js");
const {
  UserXp,
  LevelRoles,
  CountingChannels,
  CountingRoles,
  CountingUsers,
  Counts,
} = require("../db-objects.js");
const { level } = require("../utils/leveling.js");

const XP_PER_MESSAGE = 10;

async function levelingHandler(message) {
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

    if (oldLvl !== newLvl) {
      const levelRole = await LevelRoles.findOne({
        where: { guild: message.guild.id, level: newLvl },
      });

      if (levelRole) {
        const guild = await message.client.guilds.cache.get(message.guild.id);
        const member = await guild.members.cache.get(message.author.id);

        member.roles.add(levelRole.role).catch(console.error);

        message
          .reply(
            `You have leveled up to ${userLevelText} and earned the role ${roleMention(
              levelRole.role
            )}!`
          )
          .catch(console.error);
      } else {
        message
          .reply(`You have leveled up to ${userLevelText}!`)
          .catch(console.error);
      }
    }

    return userXp.save();
  }

  return UserXp.create({
    user: message.author.id,
    guild: message.guild.id,
    xp: XP_PER_MESSAGE,
  });
}

async function countingHandler(message) {
  if (message.author.bot) return true;

  const countingChannel = await CountingChannels.findOne({
    where: { guild: message.guildId, channel: message.channelId },
  });

  if (!countingChannel) return true;

  const count =
    (await Counts.findOne({ where: { guild: message.guildId } })) ??
    (await Counts.create({
      guild: message.guildId,
      currentNumber: 0,
    }));

  if (+message.content - 1 === count.currentNumber) {
    count.currentNumber += 1;
    count.save();

    const countingUser =
      (await CountingUsers.findOne({
        where: { guild: message.guild.id, user: message.author.id },
      })) ??
      (await CountingUsers.create({
        guild: message.guild.id,
        user: message.author.id,
        numCounts: 0,
      }));

    countingUser.numCounts += 1;
    countingUser.save();

    const countingRole = await CountingRoles.findOne({
      where: { guild: message.guild.id, numCounts: countingUser.numCounts },
    });

    if (countingRole) {
      const guild = await message.client.guilds.cache.get(message.guild.id);
      const member = await guild.members.cache.get(message.author.id);

      member.roles.add(countingRole.role).catch(console.error);

      message.reply(
        `You have counted ${
          countingUser.numCounts
        } times and earned the role ${roleMention(countingRole.role)}!`
      );
    }

    return true;
  }

  message.delete().catch(console.error);

  return false;
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const countValid = await countingHandler(message);

    if (countValid) {
      levelingHandler(message);
    }
  },
};
