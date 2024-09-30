const { SlashCommandBuilder, inlineCode } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flip")
    .setDescription("Flip a coin!"),
  async execute(interaction) {
    await interaction.reply({
      content: `The coin landed on ${inlineCode(
        Math.random() > 0.5 ? "heads" : "tails"
      )}!`,
    });
  },
};
