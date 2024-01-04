const {
  bold,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { LevelRoles } = require("../../db-objects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configure-leveling")
    .setDescription("Update settings for the leveling system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add-role-reward")
        .setDescription(
          "Set a role for the user to be given upon reaching a certain level"
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to give")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("The level to give the reward at")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-role-reward")
        .setDescription("Remove a role from the leveling rewards")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to give")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getRole("role");
    let embed;

    const levelRole = await LevelRoles.findOne({
      where: { role: role.id, guild: interaction.guild.id },
    });

    switch (subcommand) {
      case "add-role-reward":
        const level = interaction.options.getInteger("level");
        const levelText = bold(`Level ${level}`);

        if (levelRole) {
          levelRole.level = level;

          await levelRole.save();

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Updated role ${role} to be given at ${levelText}`);
        } else {
          LevelRoles.create({
            role: role.id,
            guild: interaction.guild.id,
            level,
          });

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Set role ${role} to be given at ${levelText}`);
        }

        break;

      case "remove-role-reward":
        if (levelRole) {
          LevelRoles.destroy({
            where: { role: role.id, guild: interaction.guild.id },
          });

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Deleted role reward ${role}`);
        } else {
          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`There was not a reward set for ${role}`);
        }

        break;
    }

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
