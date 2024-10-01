const {
  bold,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { LevelRoles } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leveling")
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
            .setDescription("The role to remove")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add-role-reward":
        return await addRoleReward(interaction);
      case "remove-role-reward":
        return await removeRoleReward(interaction);
    }
  },
};

async function addRoleReward(interaction) {
  const level = interaction.options.getInteger("level");
  const role = interaction.options.getRole("role");
  const levelText = bold(`Level ${level}`);
  const levelRole = await LevelRoles.findOne({
    where: { role: role.id, guild: interaction.guild.id },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (levelRole) {
    levelRole.level = level;

    await levelRole.save();

    embed.setDescription(`Updated role ${role} to be given at ${levelText}`);
  } else {
    LevelRoles.create({
      role: role.id,
      guild: interaction.guild.id,
      level,
    });

    embed.setDescription(`Set role ${role} to be given at ${levelText}`);
  }

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function removeRoleReward(interaction) {
  const role = interaction.options.getRole("role");
  const levelRole = await LevelRoles.findOne({
    where: { role: role.id, guild: interaction.guild.id },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (levelRole) {
    LevelRoles.destroy({
      where: { role: role.id, guild: interaction.guild.id },
    });

    embed.setDescription(`Deleted role reward ${role}`);
  } else {
    embed.setDescription(`There was not a reward set for ${role}`);
  }

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}
