const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.models.transactions = sequelize.define(
    "transactions",
    {
      orderID: {
        type: DataTypes.STRING(),
        allowNull: true,
      },
      ord_direct: {
        type: DataTypes.ENUM("buy", "sell"),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Direct is required buy/sell",
          },
        },
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
            msg: "Type is required limit/market",
          },
        },
      },
      price_usd: {
        type: DataTypes.STRING(20),
        allowNull: true,
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
            msg: "Amount is required",
          },
        },
      },
      profit: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      open_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      entry_price: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: true,
      }
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
