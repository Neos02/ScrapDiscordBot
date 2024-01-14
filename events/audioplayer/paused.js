const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  name: AudioPlayerStatus.Paused,
  execute(guildId, prevState, state) {
    console.log("Audio player is in the Paused state!");
  },
};
