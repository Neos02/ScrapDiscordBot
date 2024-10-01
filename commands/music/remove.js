const {
  bold,
  SlashCommandBuilder,
  EmbedBuilder,
  inlineCode,
} = require("discord.js");
const AudioQueue = require("#utils/queue.js");
const {
  pagination,
  ButtonTypes,
  ButtonStyles,
} = require("@devraelfreeze/discordjs-pagination");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a song from the queue")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("The position in the queue of the song to remove")
        .setRequired(true)
    ),
  async execute(interaction) {
    const position = interaction.options.getInteger("position");

    if (!interaction.member.voice.channelId) {
      return await interaction.reply({
        content: "You must be in a voice channel to use this command!",
        ephemeral: true,
      });
    }

    if (!AudioQueue.isPlaying(interaction.guild.id)) {
      return await interaction.reply({
        content: "Nothing is playing right now",
        ephemeral: true,
      });
    }

    const queue = AudioQueue.getQueue(interaction.guild.id);

    if (position <= 0 || position > queue.length) {
      return await interaction.reply({
        content: "That position is not valid",
        ephemeral: true,
      });
    }

    const removed = queue.splice(position - 1, 1)[0];

    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(
            `Removed ${inlineCode(removed.title)} from the queue!`
          ),
      ],
    });
  },
};
