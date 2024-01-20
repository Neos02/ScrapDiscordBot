const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlayer } = require("#utils/voice.js");
const AudioQueue = require("#utils/queue.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unpause")
    .setDescription("Unpauses the music"),
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

    const player = createPlayer(interaction.guild.id);

    player.unpause();

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("Paused!");

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
