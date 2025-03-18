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
    price: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });
  sequelize.models.portfolio = sequelize.define(
    "portfolio",
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: false,
    }
  );
};
