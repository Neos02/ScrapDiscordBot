const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlayer, getNextResource } = require("#utils/voice.js");
const AudioQueue = require("#utils/queue.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing song"),
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
    const nextResource = await getNextResource(interaction.guild.id);

    if (nextResource) {
      player.play(nextResource);
    } else {
      AudioQueue.destroyPlayer(interaction.guild.id);
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("Skipped!");

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
