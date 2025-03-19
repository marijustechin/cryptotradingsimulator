const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.models.transactions = sequelize.define("transactions", {
    ord_direct: {
      type: DataTypes.ENUM("buy", "sell"),
      allowNull: true,
    },
    ord_status: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: true,
    },
    ord_type: {
      type: DataTypes.ENUM("limit", "market"),
      allowNull: true,
    },
    // nustatyti triggeri kuris
    // kai narys uzstato kaina ji uzsifiksuoja kai pasiekia ta lygi
    price: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ord_pl: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    open_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closed_date: {
      type: DataTypes.DATE,
      allowNull:true
    }
  },
  {
    timestamps:false,
  }
);
  sequelize.models.portfolio = sequelize.define(
    "portfolio",
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
