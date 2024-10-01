const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  inlineCode,
} = require("discord.js");
const { CountingChannels, CountingRoles, Counts } = require("#db-objects");

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
        .setName("set-count")
        .setDescription("Set the count to a certain value")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("The new count to set")
            .setRequired(true)
        )
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

    switch (subcommand) {
      case "set-channel":
        return await setChannel(interaction);
      case "clear-channel":
        return await clearChannel(interaction);
      case "set-count":
        return await setCount(interaction);
      case "add-role-reward":
        return await ddRoleReward(interaction);
      case "remove-role-reward":
        return await removeRoleReward(interaction);
    }
  },
};

async function setChannel(interaction) {
  const channel = interaction.options.getChannel("channel");
  const countingChannel = await CountingChannels.findOne({
    where: { guild: interaction.guild.id },
  });

  if (countingChannel) {
    countingChannel.channel = channel.id;

    await countingChannel.save();
  } else {
    await CountingChannels.create({
      guild: interaction.guild.id,
      channel: channel.id,
    });

    await Counts.create({
      guild: interaction.guild.id,
      currentNumber: 0,
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Set counting to ${channel.url}`),
    ],
    ephemeral: true,
  });
}

async function clearChannel(interaction) {
  const countingChannel = await CountingChannels.findOne({
    where: { guild: interaction.guild.id },
  });

  if (countingChannel) {
    await CountingChannels.destroy({
      where: { guild: interaction.guild.id },
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Removed the counting channel`),
    ],
    ephemeral: true,
  });
}

async function setCount(interaction) {
  const newCount = interaction.options.getInteger("count");
  const count = await Counts.findOne({
    where: { guild: interaction.guild.id },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (count) {
    count.currentNumber = newCount;
    await count.save();

    embed.setDescription(
      `Updated the current count to ${inlineCode(newCount)}!`
    );
  } else {
    embed.setDescription(`There is not a counting channel for this server.`);
  }

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function addRoleReward(interaction) {
  const role = interaction.options.getRole("role");
  const numCounts = interaction.options.getInteger("num-counts");
  const countingRole = await CountingRoles.findOne({
    where: { guild: interaction.guild.id, role: role.id },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (countingRole) {
    const prevNumCounts = countingRole.numCounts;

    countingRole.numCounts = numCounts;
    await countingRole.save();

    embed.setDescription(
      `Moved reward role ${role} for counting from ${prevNumCounts} times to ${numCounts} times!`
    );
  } else {
    await CountingRoles.create({
      guild: interaction.guild.id,
      role: role.id,
      numCounts,
    });

    embed.setDescription(
      `Added reward role ${role} for counting ${numCounts} times!`
    );
  }

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function removeRoleReward(interaction) {
  const role = interaction.options.getRole("role");
  const countingRole = await CountingRoles.findOne({
    where: { guild: interaction.guild.id, role: role.id },
  });

  if (countingRole) {
    await CountingRoles.destroy({
      where: { guild: interaction.guild.id },
    });
  }

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Removed the role ${role} from counting!`),
    ],
    ephemeral: true,
  });
}
