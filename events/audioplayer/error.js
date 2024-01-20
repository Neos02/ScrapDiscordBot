const { createPlayer } = require("#utils/voice.js");
const AudioQueue = require("#utils/queue.js");
const logger = require("#logger");

module.exports = {
  name: "error",
  execute(guildId, error) {
    logger.error(error, "An unexpected error has occurred");

    const nextResource = AudioQueue.dequeue(guildId);

    if (nextResource && AudioQueue.isPlaying(guildId)) {
      const player = createPlayer(guildId);

      player.play(nextResource);
    } else {
      AudioQueue.setIsPlaying(guildId, false);
    }
  },
};
