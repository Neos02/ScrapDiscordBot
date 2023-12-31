const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

require("../models/Reactions.js")(sequelize, Sequelize.DataTypes);
require("../models/FreeGames.js")(sequelize, Sequelize.DataTypes);
require("../models/FreeGamesChannels.js")(sequelize, Sequelize.DataTypes);
require("../models/FreeGamesRoles.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    console.log("Database synced");

    sequelize.close();
  })
  .catch(console.error);
