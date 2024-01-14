const { AudioPlayerStatus } = require("@discordjs/voice");
const AudioQueue = require("../../utils/queue.js");

module.exports = {
  name: AudioPlayerStatus.Idle,
  execute(guildId, prevState, state) {
    const nextResource = AudioQueue.dequeue(guildId);

    if (nextResource && AudioQueue.isPlaying(guildId)) {
      const player = AudioQueue.getPlayer(guildId);

      player.play(nextResource);
    } else {
      AudioQueue.setIsPlaying(guildId, false);
    }
  },
};
