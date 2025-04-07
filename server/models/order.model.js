const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.models.orders = sequelize.define(
    'orders',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assetId: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Amount is required',
          },
        },
      },
      ord_direct: {
        type: DataTypes.ENUM('buy', 'sell'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Direct is required buy/sell',
          },
        },
      },
      ord_type: {
        type: DataTypes.ENUM('limit', 'market'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Type is required limit/market',
          },
        },
      },
      ord_status: {
        type: DataTypes.ENUM('open', 'closed', 'filled'),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(20, 5),
        allowNull: true,
      },
      triggerPrice: {
        type: DataTypes.DECIMAL(20, 5),
        allowNull: true,
      },
      orderPrice: {
        type: DataTypes.DECIMAL(20, 5),
        allowNull: true,
      },
      fee: {
        type: DataTypes.DECIMAL(20, 5),
        allowNull: true,
      },
      open_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      closed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
