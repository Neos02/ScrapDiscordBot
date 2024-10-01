const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { FreeGamesChannels, FreeGamesRoles } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("epic-free-games")
    .setDescription("Manages the free games announcements for Epic games")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-channel")
        .setDescription("Sets the channel for announcements")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel for free games notifications")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear-channel")
        .setDescription("Removes the channel for announcements")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-role")
        .setDescription("Sets the role for free game alerts")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role for free game alerts")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear-role")
        .setDescription("Removes the role for free game alerts")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let embed;
    const subcommand = interaction.options.getSubcommand();

    const freeGamesRole = await FreeGamesRoles.findOne({
      where: { guild: interaction.guild.id },
    });

    switch (subcommand) {
      case "set-channel":
        return await setChannel(interaction);
      case "clear-channel":
        return await clearChannel(interaction);
      case "set-role":
        return await setRole(interaction);
      case "clear-role":
        return await clearRole(interaction);
    }

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

async function setChannel(interaction) {
  const channel = interaction.options.getChannel("channel");
  const freeGamesChannel = await FreeGamesChannels.findOne({
    where: { guild: interaction.guild.id },
  });

  if (freeGamesChannel) {
    freeGamesChannel.channel = channel.id;

    await freeGamesChannel.save();
  } else {
    await FreeGamesChannels.create({
      guild: interaction.guild.id,
      channel: channel.id,
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Set free Epic Games channel to ${channel.url}`),
    ],
    ephemeral: true,
  });
}

async function clearChannel(interaction) {
  const freeGamesChannel = await FreeGamesChannels.findOne({
    where: { guild: interaction.guild.id },
  });

  if (freeGamesChannel) {
    await FreeGamesChannels.destroy({
      where: { guild: interaction.guild.id },
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Cleared the free Epic Games channel`),
    ],
    ephemeral: true,
  });
}

async function setRole(interaction) {
  const role = interaction.options.getRole("role");
  const freeGamesRole = await FreeGamesRoles.findOne({
    where: { guild: interaction.guild.id },
  });

  if (freeGamesRole) {
    freeGamesRole.role = role.id;

    await freeGamesRole.save();
  } else {
    await FreeGamesRoles.create({
      guild: interaction.guild.id,
      role: role.id,
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Set free Epic Games role to ${role}`),
    ],
    ephemeral: true,
  });
}

async function clearRole(interaction) {
  const freeGamesRole = await FreeGamesRoles.findOne({
    where: { guild: interaction.guild.id },
  });

  if (freeGamesRole) {
    await FreeGamesRoles.destroy({
      where: { guild: interaction.guild.id },
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Cleared the free Epic Games role`),
    ],
    ephemeral: true,
  });
}
