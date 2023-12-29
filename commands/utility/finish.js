const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("finish")
    .setDescription("Finish getting your Active Dev badge!"),
  async execute(interaction) {
    await interaction.reply(
      "Congratulations on getting your active dev badge!"
    );
  },
};
