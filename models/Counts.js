module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "counts",
    {
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currentNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
