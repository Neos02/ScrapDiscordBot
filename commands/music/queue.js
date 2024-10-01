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

    // Make a copy so we don't delete the queue while making pages
    const queue = [...AudioQueue.getQueue(interaction.guild.id)];
    const embeds = [];

    // Create pages with 10 roles per page
    while (queue.length) {
      const page = queue.splice(0, 10);

      embeds.push(
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("Song Queue")
          .addFields(
            page.map((song, i) => ({
              name: " ",
              value: `${bold(`${i + 1}.`)} ${inlineCode(song.title)}`,
            }))
          )
      );
    }

    if (!embeds.length) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`Song Queue`)
            .setDescription(`There is nothing in the queue`),
        ],
      });
    }

    return await pagination({
      embeds,
      author: interaction.member.user,
      interaction,
      time: 40 * 1000,
      buttons: [
        {
          type: ButtonTypes.previous,
          style: ButtonStyles.Primary,
        },
        {
          type: ButtonTypes.next,
          style: ButtonStyles.Primary,
        },
      ],
    });
  },
};
