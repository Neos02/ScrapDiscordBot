const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const { createPlayer, getNextResource } = require("../../utils/voice.js");
const AudioQueue = require("../../utils/queue.js");

module.exports = {
  name: AudioPlayerStatus.Idle,
  async execute(guildId, prevState, state) {
    const nextResource = await getNextResource(guildId);

    if (nextResource && AudioQueue.isPlaying(guildId)) {
      const player = createPlayer(guildId);

      player.play(nextResource);
    } else {
      AudioQueue.setIsPlaying(guildId, false);

      // After 1 minute of being Idle disconnect
      setTimeout(() => {
        getVoiceConnection(guildId).destroy();

        AudioQueue.destroyPlayer(guildId);
      }, 60 * 1000);
    }
  },
};
