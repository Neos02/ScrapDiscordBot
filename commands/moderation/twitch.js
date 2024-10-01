const {
  bold,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { TwitchAccounts, StreamAlertChannels } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("twitch")
    .setDescription("Manages twitch stream alerts")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a Twitch user for stream announcements")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The Twitch user to add")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a Twitch user from stream announcements")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The Twitch user to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-channel")
        .setDescription("Sets the stream announcement channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send alerts in")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear-channel")
        .setDescription("Removes the stream announcement channel")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add":
        return await add(interaction);
      case "remove":
        return await remove(interaction);
      case "set-channel":
        return await setChannel(interaction);
      case "clear-channel":
        return await clearChannel(interaction);
    }
  },
};

async function add(interaction) {
  const username = interaction.options.getString("username");
  const accountsInGuild = await TwitchAccounts.count({
    where: { guild: interaction.guild.id },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (accountsInGuild >= 100) {
    embed.setDescription("Only 100 accounts can send stream alerts.");
  } else {
    const twitchAccount = await TwitchAccounts.findOne({
      where: { guild: interaction.guild.id, username },
    });

    if (!twitchAccount) {
      await TwitchAccounts.create({
        guild: interaction.guild.id,
        username,
        isLive: false,
      });
    }

    embed.setDescription(`Added alerts for ${bold(username)}!`);
  }

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function remove(interaction) {
  const username = interaction.options.getString("username");
  const twitchAccount = await TwitchAccounts.findOne({
    where: { guild: interaction.guild.id, username },
  });

  if (twitchAccount) {
    await TwitchAccounts.destroy({
      where: { guild: interaction.guild.id, username },
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Removed alerts for ${bold(username)}!`),
    ],
    ephemeral: true,
  });
}

async function setChannel(interaction) {
  const channel = interaction.options.getChannel("channel");
  const alertsChannel = await StreamAlertChannels.findOne({
    where: { guild: interaction.guild.id },
  });

  if (alertsChannel) {
    alertsChannel.channel = channel.id;

    await alertsChannel.save();
  } else {
    await StreamAlertChannels.create({
      guild: interaction.guild.id,
      channel: channel.id,
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Set stream alerts channel to ${channel.url}`),
    ],
    ephemeral: true,
  });
}

async function clearChannel(interaction) {
  const alertsChannel = await StreamAlertChannels.findOne({
    where: { guild: interaction.guild.id },
  });

  if (alertsChannel) {
    await StreamAlertChannels.destroy({
      where: { guild: interaction.guild.id },
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Cleared the stream alerts channel`),
    ],
    ephemeral: true,
  });
}
