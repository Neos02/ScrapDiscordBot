const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { CountingChannels, CountingRoles } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counting")
    .setDescription("Configure counting system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-channel")
        .setDescription("Sets the channel to use for counting")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to use for counting")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear-channel")
        .setDescription("Removes the current counting channel")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add-role-reward")
        .setDescription("Add a role reward for counting")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to reward")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("num-counts")
            .setDescription("The number of times a user has counted")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-role-reward")
        .setDescription("Remove a counting role reward")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to reward")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel");
    const role = interaction.options.getRole("role");
    const numCounts = interaction.options.getInteger("num-counts");
    let embed;

    const countingChannel = await CountingChannels.findOne({
      where: { guild: interaction.guild.id },
    });

    const countingRole = role
      ? await CountingRoles.findOne({
          where: { guild: interaction.guild.id, role: role.id },
        })
      : null;

    switch (subcommand) {
      case "set-channel":
        if (countingChannel) {
          countingChannel.channel = channel.id;

          await countingChannel.save();
        } else {
          await CountingChannels.create({
            guild: interaction.guild.id,
            channel: channel.id,
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Set counting to ${channel.url}`);

        break;
      case "clear-channel":
        if (countingChannel) {
          await CountingChannels.destroy({
            where: { guild: interaction.guild.id },
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Removed the counting channel`);

        break;
      case "add-role-reward":
        if (countingRole) {
          const prevNumCounts = countingRole.numCounts;

          countingRole.numCounts = numCounts;
          await countingRole.save();

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `Moved reward role ${role} for counting from ${prevNumCounts} times to ${numCounts} times!`
            );
        } else {
          await CountingRoles.create({
            guild: interaction.guild.id,
            role: role.id,
            numCounts,
          });

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `Added reward role ${role} for counting ${numCounts} times!`
            );
        }

        break;
      case "remove-role-reward":
        if (countingRole) {
          await CountingRoles.destroy({
            where: { guild: interaction.guild.id },
          });
        }

        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`Removed the role ${role} from counting!`);

        break;
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
