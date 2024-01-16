const { Events } = require("discord.js");
const { Reactions } = require("../../db-objects.js");

module.exports = {
  name: Events.MessageReactionRemove,
  async execute(reaction, user) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
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

    member.roles.remove(data.role).catch(console.error);
  },
};
