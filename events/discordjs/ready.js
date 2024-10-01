const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const logger = require("#logger");
const { loadDirectoryScripts } = require("#root/utils/file-loader.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`Ready! Logged in as ${client.user.tag}`);

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

    // Run startup tasks
    const foldersPath = path.join(__dirname, "..", "..", "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandPath = path.join(foldersPath, folder);

      loadDirectoryScripts(
        commandPath,
        (command) => {
          if ("startup" in command) {
            command.startup(client);
          }
        },
        false
      );
    }
  },
};
