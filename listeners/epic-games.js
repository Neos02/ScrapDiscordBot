const { bold, time, EmbedBuilder } = require("discord.js");
const {
  FreeGames,
  FreeGamesChannels,
  FreeGamesRoles,
} = require("../db-objects.js");
const axios = require("axios");
const schedule = require("node-schedule");

module.exports = {
  run: (client) => {
    schedule.scheduleJob("0 12 * * *", () => {
      axios
        .get(
          "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US"
        )
        .then(async (res) => {
          const now = new Date();
          const games = res.data.data.Catalog.searchStore.elements.filter(
            (game) =>
              game.expiryDate &&
              now > new Date(game.effectiveDate) &&
              now < new Date(game.expiryDate)
          );

          const freeGamesChannels = await FreeGamesChannels.findAll();

          for (const game of games) {
            axios
              .get(
                `https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/${game.productSlug}`
              )
              .then(async (res) => {
                const page = res.data.pages.filter(
                  (page) => page._slug === "home"
                )[0];

                const description = page?.data.about.shortDescription;

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
                        .setDescription(description)
                        .addFields({
                          name: " ",
                          value: `${bold("Free")} until ${time(
                            new Date(game.expiryDate)
                          )}`,
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
                    .catch(console.error);
                }
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    });
  },
};
