const { createPlayer } = require("../../utils/voice.js");
const AudioQueue = require("../../utils/queue.js");

module.exports = {
  name: "error",
  execute(guildId, error) {
    console.log("Audio player is in the Error state!");
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
