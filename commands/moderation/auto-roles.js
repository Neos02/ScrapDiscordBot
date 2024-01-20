const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { AutoRoles } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("auto-roles")
    .setDescription("Update settings for auto roles")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add-role")
        .setDescription("Add a role to be automatically given to users")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to give")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("bot-only")
            .setDescription("Sets the role to only be given to new bots")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-role")
        .setDescription("Makes a role no longer automatically given to users")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("bot-only")
            .setDescription("Only remove the auto role for bots")
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getRole("role");
    const botOnly = interaction.options.getBoolean("bot-only");
    let embed;

    const autoRole = await AutoRoles.findOne({
      where: { role: role.id, guild: interaction.guild.id, botOnly },
    });

    switch (subcommand) {
      case "add-role":
        if (autoRole) {
          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`This role is already in auto roles`);
        } else {
          AutoRoles.create({
            role: role.id,
            guild: interaction.guild.id,
            botOnly,
          });

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Added auto role ${role}!`);
        }

        break;

      case "remove-role":
        if (autoRole) {
          AutoRoles.destroy({
            where: { role: role.id, guild: interaction.guild.id, botOnly },
          });

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Removed auto role ${role}`);
        } else {
          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`${role} is not in auto roles`);
        }

        break;
    }

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
