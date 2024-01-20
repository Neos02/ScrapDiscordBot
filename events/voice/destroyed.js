const { VoiceConnectionStatus } = require("@discordjs/voice");
const AudioQueue = require("#utils/queue.js");

module.exports = {
  name: VoiceConnectionStatus.Destroyed,
  execute(guildId, prevState, state) {
    AudioQueue.destroyPlayer(guildId);
  },
};
