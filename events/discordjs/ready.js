const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const logger = require("#logger");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    // Get listeners
    const listenersPath = path.join(__dirname, "..", "..", "listeners");
    const listenerFiles = fs
      .readdirSync(listenersPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of listenerFiles) {
      const filePath = path.join(listenersPath, file);
      const listener = require(filePath);

      listener.run(client);
    }

    logger.info(`Ready! Logged in as ${client.user.tag}`);
  },
};
