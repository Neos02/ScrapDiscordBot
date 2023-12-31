const Sequelize = require("sequelize");
const { loadDirectoryScripts } = require("./utils/file-loader.js");
const { slugToPascal } = require("./utils/text.js");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const models = {};

loadDirectoryScripts("models", (object) => {
  const model = object(sequelize, Sequelize.DataTypes);

  models[slugToPascal(model.name)] = model;
});

module.exports = models;
