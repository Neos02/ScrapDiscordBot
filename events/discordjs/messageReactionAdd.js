const { Events } = require("discord.js");
const { Reactions } = require("#db-objects");
const logger = require("#logger");

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        logger.error(error, "Something went wrong when fetching the message");
        return;
      }
    }

    if (!reaction.message.guildId) return;
    if (user.bot) return;

    const data = await Reactions.findOne({
      where: {
        guild: reaction.message.guildId,
        message: reaction.message.id,
        emoji: reaction.emoji.id ?? reaction.emoji.name,
      },
    });

    if (!data) return;

    const guild = await reaction.client.guilds.cache.get(
      reaction.message.guildId
    );
    const member = await guild.members.cache.get(user.id);

    member.roles.add(data.role).catch((e) => {
      logger.error(e, `Error adding role to member`);
    });
  },
};
