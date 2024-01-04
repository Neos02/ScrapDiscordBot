const { Events } = require("discord.js");
const { AutoRoles } = require("../db-objects.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const autoRoles = await AutoRoles.findAll({
      where: { guild: member.guild.id, botOnly: member.user.bot },
    });

    for (const role of autoRoles) {
      member.roles.add(role.role).catch(console.error);
    }
  },
};
