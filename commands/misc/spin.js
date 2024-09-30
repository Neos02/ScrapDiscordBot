const { SlashCommandBuilder, inlineCode } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spin")
    .setDescription("Select a random item from a provided list.")
    .addStringOption((options) =>
      options
        .setName("options")
        .setDescription("A list of items separated by commas")
        .setRequired(true)
    ),
  async execute(interaction) {
    const options = interaction.options
      .getString("options")
      .split(",")
      .map((str) => str.trim());

    await interaction.reply({
      content: `The winner is ${inlineCode(
        options[Math.floor(Math.random() * options.length)]
      )}!`,
    });
  },
};
