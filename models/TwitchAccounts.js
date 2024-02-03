module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "twitch-accounts",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isLive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
