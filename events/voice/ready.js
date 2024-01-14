const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Ready,
  execute(guildId, prevState, state) {
    console.log("Connection is in the Ready state!");
  },
};
