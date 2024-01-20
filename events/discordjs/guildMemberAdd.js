const { Events } = require("discord.js");
const { AutoRoles } = require("#db-objects");
const logger = require("#logger");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const autoRoles = await AutoRoles.findAll({
      where: { guild: member.guild.id, botOnly: member.user.bot },
    });

    for (const role of autoRoles) {
      member.roles.add(role.role).catch((e) => {
        logger.error(e, "Error adding role to member");
      });
    }
  },
};
