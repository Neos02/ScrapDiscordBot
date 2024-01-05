module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "counting-users",
    {
      user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numCounts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
