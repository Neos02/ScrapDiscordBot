const { REST, Routes } = require("discord.js");
const logger = require("#logger");

require("dotenv").config();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// for guild-based commands
rest
  .delete(
    Routes.applicationGuildCommand(
      process.env.DISCORD_CLIENT_ID,
      process.env.DISCORD_GUILD_ID,
      "1057802095836790806"
    )
  )
  .then(() => logger.info("Successfully deleted guild command"))
  .catch((e) => logger.error(e, "Error deleting guild command"));

// for global commands
// rest.delete(Routes.applicationCommand(clientId, ))
// 	.then(() => logger.info('Successfully deleted application command'))
// 	.catch((e) => logger.error(e, "Error deleting application command"));
