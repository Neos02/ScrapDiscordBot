const { Events } = require("discord.js");
const { AutoRoles } = require("#db-objects");
const logger = require("#logger");
const { deleteRoleIfNotExists } = require("#root/utils/roles.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const autoRoles = await AutoRoles.findAll({
      where: { guild: member.guild.id, botOnly: member.user.bot },
    });

    for (const role of autoRoles) {
      deleteRoleIfNotExists(member.guild, role.role);

      member.roles.add(role.role).catch((e) => {
        logger.error(e, "Error adding role to member");
      });
    }
  },
};
