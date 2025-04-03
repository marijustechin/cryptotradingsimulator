const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.models.userLogs = sequelize.define(
    'userLogs',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // nereikia automatiniu updated_at, created_at
      timestamps: false,
    }
  );
};
