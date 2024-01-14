const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { loadDirectoryScripts } = require("./file-loader.js");

function createVoiceConnection({ channelId, guildId, adapterCreator }) {
  const connection = joinVoiceChannel({ channelId, guildId, adapterCreator });

  loadDirectoryScripts("events/voice", (event) => {
    connection.on(event.name, (...args) => event.execute(guildId, ...args));
  });

  return connection;
}

module.exports = { createVoiceConnection };
