const {
  bold,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  roleMention,
} = require("discord.js");
const { LevelRoles } = require("#db-objects");
const { deleteRoleIfNotExists } = require("#root/utils/roles.js");
const {
  pagination,
  ButtonTypes,
  ButtonStyles,
} = require("@devraelfreeze/discordjs-pagination");

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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List the active role rewards for leveling")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add-role-reward":
        return await addRoleReward(interaction);
      case "remove-role-reward":
        return await removeRoleReward(interaction);
      case "list":
        return await list(interaction);
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

async function list(interaction) {
  const levelRoles = (
    await LevelRoles.findAll({
      where: { guild: interaction.guild.id },
    })
  ).filter((role) => !deleteRoleIfNotExists(interaction.guild, role.role));
  const embeds = [];

  // Create pages with 10 roles per page
  while (levelRoles.length) {
    const page = levelRoles.splice(0, 10);

    embeds.push(
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Active Level Roles")
        .addFields(
          page.map((role) => ({
            name: `Level ${role.level}`,
            value: roleMention(role.role),
          }))
        )
    );
  }

  if (!embeds.length) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle(`Active Level Roles`)
          .setDescription(`There are currently no active level roles.`),
      ],
      ephemeral: true,
    });
  }

  return await pagination({
    embeds,
    author: interaction.member.user,
    interaction,
    ephemeral: true,
    time: 40 * 1000,
    buttons: [
      {
        type: ButtonTypes.previous,
        style: ButtonStyles.Primary,
      },
      {
        type: ButtonTypes.next,
        style: ButtonStyles.Primary,
      },
    ],
  });
}
