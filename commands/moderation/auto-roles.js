const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  roleMention,
} = require("discord.js");
const {
  pagination,
  ButtonTypes,
  ButtonStyles,
} = require("@devraelfreeze/discordjs-pagination");
const { AutoRoles } = require("#db-objects");
const { deleteRoleIfNotExists } = require("#root/utils/roles.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("auto-roles")
    .setDescription("View and update settings for auto roles")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add-role")
        .setDescription("Adds a role to be automatically given to users")
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
        .setDescription(
          "Removes a role from being automatically given to users"
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("bot-only")
            .setDescription("Sets the role to be removed for bots")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List the active auto roles")
        .addBooleanOption((option) =>
          option
            .setName("bot-only")
            .setDescription("Sets the role to be removed for bots")
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add-role":
        return await addRole(interaction);
      case "remove-role":
        return await removeRole(interaction);
      case "list":
        return await list(interaction);
    }
  },
};

async function addRole(interaction) {
  const role = interaction.options.getRole("role");
  const botOnly = interaction.options.getBoolean("bot-only") ?? false;
  const autoRole = await AutoRoles.findOne({
    where: { role: role.id, guild: interaction.guild.id, botOnly },
  });
  let embed;

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

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function removeRole(interaction) {
  const role = interaction.options.getRole("role");
  const botOnly = interaction.options.getBoolean("bot-only") ?? false;
  const autoRole = await AutoRoles.findOne({
    where: { role: role.id, guild: interaction.guild.id, botOnly },
  });
  let embed;

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

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function list(interaction) {
  const botOnly = interaction.options.getBoolean("bot-only") ?? false;
  const autoRoles = (
    await AutoRoles.findAll({
      where: { guild: interaction.guild.id, botOnly },
    })
  ).filter((role) => !deleteRoleIfNotExists(interaction.guild, role.role));
  const embeds = [];

  // Create pages with 10 roles per page
  while (autoRoles.length) {
    const page = autoRoles.splice(0, 10);

    embeds.push(
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Active Auto Roles (${botOnly ? "Bot" : "User"})`)
        .addFields(
          page.map((role) => ({
            name: " ",
            value: roleMention(role.id),
          }))
        )
    );
  }

  if (!embeds.length) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle(`Active Auto Roles (${botOnly ? "Bot" : "User"})`)
          .setDescription(
            `There are currently no active auto roles for this type of user`
          ),
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
