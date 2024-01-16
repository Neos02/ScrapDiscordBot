const { bold, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const AudioQueue = require("../../utils/queue.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the music queue"),
  async execute(interaction) {
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

    // Get first 25 items of queue
    const queueItems = AudioQueue.getQueue(interaction.guild.id).slice(0, 25);

    if (!queueItems.length) {
      return await interaction.reply({
        content: "There is nothing in the queue right now",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Queue")
      .addFields(
        queueItems.map((video, i) => ({
          name: " ",
          value: bold(`${i + 1}. ${video.title}`),
        }))
      );

    return await interaction.reply({ embeds: [embed] });
  },
};
