const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.models.settings = sequelize.define(
    'settings',
    {
      market_order_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.045,
      },
      limit_order_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.015,
      },
      fake_users_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
    },
    { timestamps: false }
  );
};
