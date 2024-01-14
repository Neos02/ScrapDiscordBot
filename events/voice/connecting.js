const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Connecting,
  execute(guildId, prevState, state) {
    console.log("Connection is in the Connecting state!");
  },
};
