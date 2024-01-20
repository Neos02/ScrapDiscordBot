const { bold, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  createVoiceConnection,
  createPlayer,
  getNextResource,
} = require("#utils/voice.js");
const AudioQueue = require("#utils/queue.js");
const { ytSearch } = require("#utils/youtube.js");
const logger = require("#logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song in voice chat")
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

    await interaction.deferReply();

    ytSearch(song)
      .then(async (result) => {
        const video = {
          title: result.data.items[0].snippet.title,
          id: result.data.items[0].id.videoId,
        };
        let embed;

        AudioQueue.enqueue(interaction.guild.id, video);

        if (AudioQueue.isPlaying(interaction.guild.id)) {
          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Added ${bold(video.title)} to queue!`);
        } else {
          const player = createPlayer(interaction.guild.id);

          AudioQueue.setIsPlaying(interaction.guild.id, true);
          connection.subscribe(player);
          player.play(await getNextResource(interaction.guild.id));

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `Playing ${bold(video.title)} in ${
                interaction.member.voice.channel
              }`
            );
        }

        interaction.editReply({ embeds: [embed] });
      })
      .catch((e) => {
        logger.error(e, "Error searching for song");

        interaction.editReply("An error has occurred");
      });
  },
};
