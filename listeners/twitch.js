const { bold, time, EmbedBuilder, RESTJSONErrorCodes } = require("discord.js");
const axios = require("axios");
const schedule = require("node-schedule");
const logger = require("#logger");
const { TwitchAccounts, StreamAlertChannels } = require("#db-objects");

const TWITCH_BASE_URL = "https://api.twitch.tv/";

async function getTwitchStreams(client) {
  logger.info("Retrieving Twitch streams");

  const twitchAccounts = await TwitchAccounts.findAll();
  const accessToken = await axios.post("https://id.twitch.tv/oauth2/token", {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  if (!accessToken) {
    logger.error("Could not get twitch access token");
    return;
  }

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
          Authorization: `Bearer ${accessToken.data.access_token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
        baseURL: TWITCH_BASE_URL,
        validateStatus: (status) => {
          return status >= 200;
        },
      })
      .then(async (res) => {
        for (const account of accounts[guild]) {
          const stream = res.data.data.find(
            (stream) => account.username === stream.user_login
          );

          if (!account.isLive && stream) {
            // If the account was not already live and a stream exists
            // set it to live and send an alert
            account.isLive = true;
            await account.save();

            const gameName = stream["game_name"];

            const fields = [];

            if (gameName.length) {
              fields.push({
                name: "Game",
                value: gameName.length ? gameName : "",
                inline: true,
              });
            }

            fields.push({
              name: "Viewers",
              value: `${stream["viewer_count"]}`,
              inline: true,
            });

            const embed = new EmbedBuilder()
              .setColor("Blurple")
              .setAuthor({ name: `${stream.user_name} is now live on Twitch!` })
              .setTitle(stream.title)
              .setURL(`https://twitch.tv/${stream.user_login}`)
              .addFields(...fields)
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
          } else if (account.isLive && !stream) {
            // Otherwise the account is not live and we should store that
            account.isLive = false;
            await account.save();
          }
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
    schedule.scheduleJob("*/10 * * * *", () => getTwitchStreams(client));
  },
};
