const { joinVoiceChannel, createAudioPlayer } = require("@discordjs/voice");
const AudioQueue = require("../utils/queue.js");
const { loadDirectoryScripts } = require("./file-loader.js");

function createVoiceConnection({ channelId, guildId, adapterCreator }) {
  const connection = joinVoiceChannel({ channelId, guildId, adapterCreator });

  loadDirectoryScripts("events/voice", (event) => {
    connection.on(event.name, (...args) => event.execute(guildId, ...args));
  });

  return connection;
}

function createPlayer(guildId) {
  return AudioQueue.getPlayer(guildId);
}

module.exports = { createVoiceConnection, createPlayer };
