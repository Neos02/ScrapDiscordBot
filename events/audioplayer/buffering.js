const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  name: AudioPlayerStatus.Buffering,
  execute(guildId, prevState, state) {
    console.log("Audio player is in the Buffering state!");
  },
};
