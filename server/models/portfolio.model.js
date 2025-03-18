const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.models.transactions = sequelize.define("transactions", {
    type: {
      type: DataTypes.ENUM("buy", "sell"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    openprice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    closeprice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
  });
  sequelize.models.portfolio = sequelize.define(
    "portfolio",
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
