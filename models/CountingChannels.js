module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "counting-channels",
    {
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      channel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
