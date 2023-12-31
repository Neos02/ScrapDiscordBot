const Sequelize = require("sequelize");
const { loadDirectoryScripts } = require("../utils/file-loader.js");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

loadDirectoryScripts("models", (model) => {
  model(sequelize, Sequelize.DataTypes);
});

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    console.log("Database synced");

    sequelize.close();
  })
  .catch(console.error);
