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
    let embed;
    let twitchAccount;
    let alertsChannel;
    const subcommand = interaction.options.getSubcommand();
    const username = interaction.options.getString("username");
    const channel = interaction.options.getChannel("channel");

    if (username) {
      twitchAccount = await TwitchAccounts.findOne({
        where: { guild: interaction.guild.id, username },
      });
    }

    if (channel) {
      alertsChannel = await StreamAlertChannels.findOne({
        where: { guild: interaction.guild.id },
      });
    }

    switch (subcommand) {
      case "add":
        const accountsInGuild = await TwitchAccounts.count({
          where: { guild: interaction.guild.id },
        });

        if (accountsInGuild >= 100) {
          return await interaction.reply({
            content: "Only 100 accounts can send stream alerts.",
            ephemeral: true,
          });
        }

        if (!twitchAccount) {
          await TwitchAccounts.create({
            guild: interaction.guild.id,
            username,
            isLive: false,
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Added alerts for ${bold(username)}!`);

        break;
      case "remove":
        if (twitchAccount) {
          await TwitchAccounts.destroy({
            where: { guild: interaction.guild.id, username },
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Removed alerts for ${bold(username)}!`);

        break;
      case "set-channel":
        if (alertsChannel) {
          alertsChannel.channel = channel.id;

          await alertsChannel.save();
        } else {
          await StreamAlertChannels.create({
            guild: interaction.guild.id,
            channel: channel.id,
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Set stream alerts channel to ${channel.url}`);

        break;
      case "clear-channel":
        if (alertsChannel) {
          await StreamAlertChannels.destroy({
            where: { guild: interaction.guild.id },
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Cleared the stream alerts channel`);

        break;
    }

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
