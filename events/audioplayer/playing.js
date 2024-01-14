const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  name: AudioPlayerStatus.Playing,
  execute(guildId, prevState, state) {
    console.log("Audio player is in the Playing state!");
  },
};
