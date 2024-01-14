const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createVoiceConnection } = require("../../utils/voice.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song in vc")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    const song = interaction.options.getString("song");

    if (!interaction.member.voice.channelId) {
      return await interaction.reply({
        content: "You must be in a voice channel to use this command!",
        ephemeral: true,
      });
    }

    const connection = createVoiceConnection({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
    });

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`Playing ${song}`);

    return await interaction.reply({ embeds: [embed] });
  },
};
