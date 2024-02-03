module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "stream-alert-channels",
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
