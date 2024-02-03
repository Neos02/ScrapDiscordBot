const { bold, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { UserXp } = require("#db-objects");
const { level, xp } = require("#utils/leveling.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Get a user's level")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user")
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const userXp = await UserXp.findOne({
      where: { user: user.id, guild: interaction.guild.id },
    });

    let embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
      })
      .setTitle("Level 0")
      .setDescription(`${xp(1)} XP away from ${bold("Level 1")}`);

    if (userXp) {
      const lvl = level(userXp.xp);
      const nextLvlText = bold(`Level ${lvl + 1}`);

      embed
        .setTitle(`Level ${lvl}`)
        .setDescription(
          `${xp(lvl + 1) - userXp.xp} XP away from ${nextLvlText}`
        );

      return await interaction.reply({ embeds: [embed] });
    }

    return await interaction.reply({ embeds: [embed] });
  },
};
