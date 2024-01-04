module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "auto-roles",
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      botOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
