const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Destroyed,
  execute(guildId, prevState, state) {
    console.log("Connection is in the Destroyed state!");
  },
};
