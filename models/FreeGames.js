module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "free-games",
    {
      game: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
