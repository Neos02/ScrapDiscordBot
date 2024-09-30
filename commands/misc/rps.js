const { SlashCommandBuilder } = require("discord.js");
const { capitalize } = require("#utils/text.js");

const choices = ["rock", "paper", "scissors"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Rock, paper, scissors")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Rock, paper, or scissors")
        .setRequired(true)
        .addChoices(
          ...choices.map((choice) => ({ name: choice, value: choice }))
        )
    ),
  async execute(interaction) {
    const selectedChoice = interaction.options.getString("choice");
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let content;

    if (selectedChoice === botChoice) {
      content = `It's a draw! We both chose ${selectedChoice}`;
    } else if (
      (selectedChoice === "rock" && botChoice === "scissors") ||
      (selectedChoice === "paper" && botChoice === "rock") ||
      (selectedChoice === "scissors" && botChoice === "paper")
    ) {
      content = `You win! ${capitalize(selectedChoice)} beats ${botChoice}`;
    } else {
      content = `You lose! ${capitalize(botChoice)} beats ${selectedChoice}`;
    }

    await interaction.reply({ content, ephemeral: true });
  },
};
