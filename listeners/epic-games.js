const { bold, time, EmbedBuilder, RESTJSONErrorCodes } = require("discord.js");
const axios = require("axios");
const schedule = require("node-schedule");
const { FreeGames, FreeGamesChannels, FreeGamesRoles } = require("#db-objects");
const logger = require("#logger");

function getFreeGames(client) {
  axios
    .get(
      "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US"
    )
    .then(async (res) => {
      const games = res.data.data.Catalog.searchStore.elements.filter(
        (game) => game.status === "ACTIVE"
      );
      const freeGamesChannels = await FreeGamesChannels.findAll();

      for (const game of games) {
        for (const freeGamesChannel of freeGamesChannels) {
          const freeGame = await FreeGames.findOne({
            where: { guild: freeGamesChannel.guild, game: game.id },
          });

          if (freeGame) {
            continue;
          }

          const freeGamesRole = await FreeGamesRoles.findOne({
            where: { guild: freeGamesChannel.guild },
          });

          const guild = client.guilds.cache.get(freeGamesChannel.guild);
          const role = freeGamesRole
            ? `${guild.roles.cache.get(freeGamesRole.role)}`
            : "";

          client.channels
            .fetch(freeGamesChannel.channel)
            .then((channel) => {
              const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(game.title)
                .addFields({
                  name: " ",
                  value: game.expiryDate
                    ? `${bold("Free")} until ${time(new Date(game.expiryDate))}`
                    : " ",
                })
                .setThumbnail("attachment://epic-games.png")
                .setImage(game.keyImages[0].url)
                .setURL(
                  `https://store.epicgames.com/en-US/p/${game.productSlug}`
                );

              FreeGames.create({ guild: guild.id, game: game.id });

              channel.send({
                content: role,
                embeds: [embed],
                files: ["./assets/images/logos/epic-games.png"],
              });
            })
            .catch((e) => {
              if (e.code === RESTJSONErrorCodes.UnknownChannel) {
                // Delete the channel from the database
                FreeGamesChannels.destroy({
                  where: { guild: freeGamesChannel.guild },
                });
              }

              logger.error(e, "Error retrieving data");
            });
        }
      }
    })
    .catch((e) => {
      logger.error(e, "Error retrieving data");
    });
}

module.exports = {
  run: (client) => {
    getFreeGames(client);
    schedule.scheduleJob("0 0,12 * * *", () => getFreeGames(client));
  },
};
