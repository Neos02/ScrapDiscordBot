const { REST, Routes } = require("discord.js");

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
  .then(() => console.log("Successfully deleted guild command"))
  .catch(console.error);

// for global commands
// rest.delete(Routes.applicationCommand(clientId, ))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);
