const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about a user or server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Info about a user")
        .addUserOption((option) =>
          option.setName("target").setDescription("The user")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Info about the server")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "user") {
      const user = interaction.options.getUser("target");

      if (user) {
        await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
      } else {
        await interaction.reply(
          `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
        );
      }
    } else if (subcommand === "server") {
      await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    }
  },
};
