const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const AudioQueue = require("#utils/queue.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music"),
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

    const connection = getVoiceConnection(interaction.guild.id);

    AudioQueue.destroyPlayer(interaction.guild.id);
    connection.destroy();

    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("Music has been stopped"),
      ],
    });
  },
};
