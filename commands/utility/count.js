const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CountingUsers } = require("#db-objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("Get the number of times a user has counted")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user")
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const countingUser = (await CountingUsers.findOne({
      where: { user: user.id, guild: interaction.guild.id },
    })) ?? { numCounts: 0 };

    let embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
      })
      .setDescription(
        `${user.username} has counted ${countingUser.numCounts} times`
      );

    return await interaction.reply({ embeds: [embed] });
  },
};
