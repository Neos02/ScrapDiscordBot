const Sequelize = require("sequelize");
const { loadDirectoryScripts } = require("#utils/file-loader.js");
const logger = require("#logger");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

loadDirectoryScripts("models", (model) => {
  model(sequelize, Sequelize.DataTypes);
});

sequelize
  .sync()
  .then(async () => {
    logger.info("Database synced");

    sequelize.close();
  })
  .catch((e) => {
    logger.error(e, "Error syncing database");
  });
