const { createPlayer } = require("../../utils/voice.js");
const AudioQueue = require("../../utils/queue.js");

module.exports = {
  name: "error",
  execute(guildId, error) {
    console.error(error);

    const nextResource = AudioQueue.dequeue(guildId);

    if (nextResource && AudioQueue.isPlaying(guildId)) {
      const player = createPlayer(guildId);

      player.play(nextResource);
    } else {
      AudioQueue.setIsPlaying(guildId, false);
    }
  },
};
