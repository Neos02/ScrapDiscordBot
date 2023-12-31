module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "free-games-roles",
    {
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
