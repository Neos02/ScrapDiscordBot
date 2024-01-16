const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");
const AudioQueue = require("../utils/queue.js");
const { loadDirectoryScripts } = require("./file-loader.js");

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

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

async function getNextResource(guildId) {
  const nextVideo = AudioQueue.dequeue(guildId);

  if (!nextVideo) {
    return null;
  }

  const source = await play.stream(`${YOUTUBE_BASE_URL}${nextVideo.id}`, {
    discordPlayerCompatibility: true,
  });
  const resource = createAudioResource(source.stream, {
    inputType: source.type,
  });

  return resource;
}

module.exports = { createVoiceConnection, createPlayer, getNextResource };
