const { SlashCommandBuilder, bold } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flip")
    .setDescription("Flip a coin!"),
  async execute(interaction) {
    await interaction.reply({
      content: `The coin landed on ${bold(
        Math.random() > 0.5 ? "heads" : "tails"
      )}!`,
    });
  },
};
