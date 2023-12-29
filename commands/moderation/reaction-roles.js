const {
  parseEmoji,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { Reactions } = require("../../db-objects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reaction-roles")
    .setDescription("Manage reaction roles")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Creates a message for the reaction roles")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Sets the message to be displayed")
        )
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

    if (subcommand === "create") {
      const text =
        interaction.options.getString("message") ??
        "React here to get your roles!";

      return await interaction.reply(text);
    }

    let e;
    const formattedEmoji = interaction.options.getString("emoji");
    const emoji = parseEmoji(formattedEmoji);
    const message = await interaction.channel.messages
      .fetch(interaction.options.getString("message-id"))
      .catch((err) => (e = err));

    if (e) {
      return await interaction.reply({
        content: `Be sure to get a valid message id!`,
        ephemeral: true,
      });
    }

    const data = await Reactions.findOne({
      where: {
        guild: interaction.guild.id,
        message: message.id,
        emoji: emoji.id ?? emoji.name,
      },
    });
    let embed;

    switch (subcommand) {
      case "add":
        if (data) {
          return await interaction.reply({
            content: `This reaction is already setup using ${formattedEmoji} on this message`,
            ephemeral: true,
          });
        }

        const role = interaction.options.getRole("role");
        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(
            `Added reaction role to ${message.url} with ${formattedEmoji} for ${role}`
          );

        await message.react(`${formattedEmoji}`).catch((err) => (e = err));

        if (e) {
          return await interaction.reply({
            content: `Be sure to use a valid emoji!`,
            ephemeral: true,
          });
        }

        await Reactions.create({
          guild: interaction.guild.id,
          message: message.id,
          emoji: emoji.id ?? emoji.name,
          role: role.id,
        });

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });

      case "remove":
        if (!data) {
          return await interaction.reply({
            content: `That reaction role doesn't exist`,
            ephemeral: true,
          });
        }

        const reaction = message.reactions.cache.get(emoji.id ?? emoji.name);
        embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(
            `Removed reaction role from ${message.url} with ${formattedEmoji}`
          );

        reaction?.remove().catch((err) => (e = err));

        await Reactions.destroy({
          where: {
            guild: interaction.guild.id,
            message: message.id,
            emoji: emoji.id ?? emoji.name,
          },
        });

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
    }
  },
};
