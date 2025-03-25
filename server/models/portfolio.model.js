const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.models.transactions = sequelize.define(
    "transactions",
    {
      ord_direct: {
        type: DataTypes.ENUM("buy", "sell"),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Direct is required buy/sell'
          }
        }
      },
      ord_status: {
        type: DataTypes.ENUM("open", "closed", "filled"),
        allowNull: false,
      },
      ord_type: {
        type: DataTypes.ENUM("limit", "market"),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Type is required limit/market'
          }
        }
      },
      price: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      ord_pl: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Amount is required'
          }
        }
      },
      open_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      order_value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  sequelize.models.portfolio = sequelize.define(
    "portfolio",
    {
      amount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
