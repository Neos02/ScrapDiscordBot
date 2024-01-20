const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { loadDirectoryScripts } = require("#utils/file-loader.js");
const logger = require("#logger");

require("dotenv").config();

const argv = yargs(hideBin(process.argv)).argv;
const deployGlobal = (argv.global || argv.g) ?? false;
const commands = [];

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, "..", "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);

  loadDirectoryScripts(
    commandsPath,
    (command, filePath) => {
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        logger.warn(
          `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    },
    false
  );
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
  try {
    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    if (deployGlobal) {
      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      );

      logger.info(
        `Successfully reloaded ${data.length} application (/) commands globally.`
      );
    } else {
      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        { body: commands }
      );

      logger.info(
        `Successfully reloaded ${data.length} application (/) commands in guild ${process.env.DISCORD_GUILD_ID}.`
      );
    }
  } catch (error) {
    logger.error(error, "An unexpected error has occurred");
  }
})();
