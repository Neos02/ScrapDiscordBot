const { createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");

class AudioQueue {
  static queue = {};
  static players = {};

  static enqueue = (guildId, resource) => {
    if (!this.queue[guildId]) {
      this.queue[guildId] = [];
    }

    this.queue[guildId].push(resource);
  };

  static dequeue = (guildId) => {
    if (!this.queue[guildId]) {
      return null;
    }

    return this.queue[guildId].shift();
  };

  static clear = (guildId) => {
    if (this.queue[guildId]) {
      delete this.queue[guildId];
    }
  };

  static getPlayer = (guildId) => {
    if (!this.players[guildId]) {
      this.players[guildId] = {
        player: createAudioPlayer({
          behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
        }),
        isPlaying: false,
      };
    }

    return this.players[guildId].player;
  };

  static isPlaying = (guildId) => {
    return this.players[guildId]?.isPlaying;
  };

  static setIsPlaying = (guildId, isPlaying) => {
    if (this.players[guildId]) {
      this.players[guildId].isPlaying = isPlaying;
    }
  };
}

module.exports = AudioQueue;
