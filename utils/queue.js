const { createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const { loadDirectoryScripts } = require("#utils/file-loader.js");

class AudioQueue {
  static queue = {};
  static players = {};

  static enqueue = (guildId, video) => {
    if (!this.queue[guildId]) {
      this.queue[guildId] = [video];
      return;
    }

    this.queue[guildId].push(video);
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

  static getQueue = (guildId) => {
    return this.queue[guildId] ?? [];
  };

  static getPlayer = (guildId) => {
    if (!this.players[guildId]) {
      this.players[guildId] = {
        player: createAudioPlayer({
          behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
        }),
        isPlaying: false,
      };

      loadDirectoryScripts("events/audioplayer", (event) => {
        this.players[guildId].player.on(event.name, (...args) =>
          event.execute(guildId, ...args)
        );
      });
    }

    return this.players[guildId].player;
  };

  static destroyPlayer(guildId) {
    if (this.players[guildId]) {
      this.players[guildId].player.stop();
      delete this.players[guildId];
    }
  }

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
