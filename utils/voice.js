const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const AudioQueue = require("#utils/queue.js");
const { loadDirectoryScripts } = require("#utils/file-loader.js");

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

  const stream = ytdl(`${YOUTUBE_BASE_URL}${nextVideo.id}`, {
    filter: "audioonly",
  });
  const resource = createAudioResource(stream);

  return resource;
}

module.exports = { createVoiceConnection, createPlayer, getNextResource };
