const {
  parseEmoji,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { Reactions } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reaction-roles")
    .setDescription("Manage reaction roles")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a message to use for reaction roles")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a reaction role to a message")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message to react to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to use for the reaction")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a reaction role to a message")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message to react to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to use for the reaction")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create":
        return await create(interaction);
      case "add":
        return await add(interaction);
      case "remove":
        return await remove(interaction);
    }
  },
};

async function create(interaction) {
  return await interaction.reply(
    interaction.options.getString("message") ?? "React here to get your roles!"
  );
}

async function add(interaction) {
  const role = interaction.options.getRole("role");
  const messageId = interaction.options.getString("message-id");
  const message = await interaction.channel.messages.fetch(messageId);
  const formattedEmoji = interaction.options.getString("emoji");
  const emoji = parseEmoji(formattedEmoji);
  const reaction = await Reactions.findOne({
    where: {
      guild: interaction.guild.id,
      message: messageId,
      emoji: emoji.id ?? emoji.name,
    },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (reaction) {
    embed.setDescription(
      `This reaction is already setup using ${formattedEmoji} on this message`
    );
  } else if (!message) {
    embed.setDescription("Be sure to get a valid message id!");
  } else {
    const reacted = message.react(`${formattedEmoji}`);

    if (reacted) {
      embed.setDescription(
        `Added reaction role to ${message.url} with ${formattedEmoji} for ${role}`
      );

      await Reactions.create({
        guild: interaction.guild.id,
        message: message.id,
        emoji: emoji.id ?? emoji.name,
        role: role.id,
      });
    } else {
      embed.setDescription("An unexpected error occurred.");
    }
  }

  return await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
}

async function remove(interaction) {
  const messageId = interaction.options.getString("message-id");
  const message = await interaction.channel.messages.fetch(messageId);
  const formattedEmoji = interaction.options.getString("emoji");
  const emoji = parseEmoji(formattedEmoji);
  const reaction = await Reactions.findOne({
    where: {
      guild: interaction.guild.id,
      message: messageId,
      emoji: emoji.id ?? emoji.name,
    },
  });
  const embed = new EmbedBuilder().setColor("Blurple");

  if (!reaction) {
    embed.setDescription("That reaction role doesn't exist.");
  } else {
    const reactionToRemove = message.reactions.cache.get(
      emoji.id ?? emoji.name
    );
    const removed = reactionToRemove?.remove();

    if (removed) {
      embed.setDescription(
        `Removed reaction role from ${message.url} with ${formattedEmoji}!`
      );

      await Reactions.destroy({
        where: {
          guild: interaction.guild.id,
          message: message.id,
          emoji: emoji.id ?? emoji.name,
        },
      });
    } else {
      embed.setDescription('"An unexpected error occurred."');
    }
  }

  return await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
}
