const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Reactions = require("./models/Reactions.js")(
  sequelize,
  Sequelize.DataTypes
);
const FreeGames = require("./models/FreeGames.js")(
  sequelize,
  Sequelize.DataTypes
);
const FreeGamesChannels = require("./models/FreeGamesChannels.js")(
  sequelize,
  Sequelize.DataTypes
);
const FreeGamesRoles = require("./models/FreeGamesRoles.js")(
  sequelize,
  Sequelize.DataTypes
);

module.exports = { FreeGames, FreeGamesChannels, FreeGamesRoles, Reactions };
