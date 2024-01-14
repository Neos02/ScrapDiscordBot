const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Signalling,
  execute(guildId, prevState, state) {
    console.log("Connection is in the Signalling state!");
  },
};
