const { bold, time, EmbedBuilder, RESTJSONErrorCodes } = require("discord.js");
const axios = require("axios");
const schedule = require("node-schedule");
const logger = require("#logger");
const { TwitchAccounts, StreamAlertChannels } = require("#db-objects");

const TWITCH_BASE_URL = "https://api.twitch.tv/";

async function getTwitchStreams(client) {
  logger.info("Retrieving Twitch streams");

  const twitchAccounts = await TwitchAccounts.findAll();
  const accounts = {};
  const guilds = [];

  // Group twitch accounts by guild
  for (const account of twitchAccounts) {
    if (!accounts[account.guild]) {
      guilds.push(account.guild);

      accounts[account.guild] = [];
    }

    accounts[account.guild].push(account);
  }

  for (const guild of guilds) {
    const alertsChannel = await StreamAlertChannels.findOne({
      where: { guild },
    });

    if (!alertsChannel) {
      continue;
    }

    const queryString = accounts[guild]
      .map((account) => `user_login=${account.username}`)
      .join("&");

    axios
      .get(`/helix/streams?type=live&${queryString}`, {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
        baseURL: TWITCH_BASE_URL,
        validateStatus: (status) => {
          return status >= 200;
        },
      })
      .then((res) => {
        for (const stream of res.data.data) {
          const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({ name: `${stream.user_name} is now live on Twitch!` })
            .setTitle(stream.title)
            .setURL(`https://twitch.tv/${stream.user_login}`)
            .addFields(
              { name: "Game", value: stream["game_name"], inline: true },
              {
                name: "Viewers",
                value: `${stream["viewer_count"]}`,
                inline: true,
              }
            )
            .setImage(
              stream.thumbnail_url
                .replace("{width}", "1920")
                .replace("{height}", "1080")
            );

          client.channels
            .fetch(alertsChannel.channel)
            .then((channel) => {
              channel.send({
                embeds: [embed],
              });
            })
            .catch((e) => {
              if (e.code === RESTJSONErrorCodes.UnknownChannel) {
                // Delete the channel from the database
                StreamAlertChannels.destroy({
                  where: { guild: alertsChannel.guild },
                });
              }

              logger.error(e, "Error retrieving data");
            });
        }
      })
      .catch((e) => {
        logger.error(e, "An unexpected error has occurred");
      });
  }
}

module.exports = {
  run: (client) => {
    getTwitchStreams(client);
    schedule.scheduleJob("/10 * * * *", () => getTwitchStreams(client));
  },
};
