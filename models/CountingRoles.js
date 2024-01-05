module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "counting-roles",
    {
      role: {
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
