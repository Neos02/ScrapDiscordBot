const { bold, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createAudioResource } = require("@discordjs/voice");
const { createVoiceConnection, createPlayer } = require("../../utils/voice.js");
const AudioQueue = require("../../utils/queue.js");
const { ytSearch } = require("../../utils/youtube.js");
const play = require("play-dl");

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
        const videoId = result.data.items[0].id.videoId;
        const title = result.data.items[0].snippet.title;
        const source = await play.stream(
          `https://www.youtube.com/watch?v=${videoId}`,
          {
            discordPlayerCompatibility: true,
          }
        );
        const resource = createAudioResource(source.stream, {
          inputType: source.type,
        });
        let embed;

        if (AudioQueue.isPlaying(interaction.guild.id)) {
          AudioQueue.enqueue(interaction.guild.id, resource);

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Added ${bold(title)} to queue!`);
        } else {
          const player = createPlayer(interaction.guild.id);

          AudioQueue.setIsPlaying(interaction.guild.id, true);
          connection.subscribe(player);
          player.play(resource);

          embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `Playing ${bold(title)} in ${interaction.member.voice.channel}`
            );
        }

        interaction.editReply({ embeds: [embed] });
      })
      .catch((e) => {
        console.error(e);

        interaction.editReply("An error has occurred");
      });
  },
};
