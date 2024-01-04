const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { FreeGamesChannels, FreeGamesRoles } = require("../../db-objects.js");

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

    const freeGamesChannel = await FreeGamesChannels.findOne({
      where: { guild: interaction.guild.id },
    });

    const freeGamesRole = await FreeGamesRoles.findOne({
      where: { guild: interaction.guild.id },
    });

    switch (subcommand) {
      case "set-channel":
        const channel = interaction.options.getChannel("channel");

        if (freeGamesChannel) {
          freeGamesChannel.channel = channel.id;

          await freeGamesChannel.save();
        } else {
          await FreeGamesChannels.create({
            guild: interaction.guild.id,
            channel: channel.id,
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Set free Epic Games channel to ${channel.url}`);

        break;
      case "clear-channel":
        if (freeGamesChannel) {
          await FreeGamesChannels.destroy({
            where: { guild: interaction.guild.id },
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Cleared the free Epic Games channel`);

        break;

      case "set-role":
        const role = interaction.options.getRole("role");

        if (freeGamesRole) {
          freeGamesRole.role = role.id;

          await freeGamesRole.save();
        } else {
          await FreeGamesRoles.create({
            guild: interaction.guild.id,
            role: role.id,
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Set free Epic Games role to ${role}`);

        break;

      case "clear-role":
        if (freeGamesRole) {
          await FreeGamesRoles.destroy({
            where: { guild: interaction.guild.id },
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Cleared the free Epic Games role`);

        break;
    }

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
