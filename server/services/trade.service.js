const sequelize = require("../config/db");
const { asset, transactions, portfolio, wallet } = sequelize.models;
const ApiError = require("../exceptions/api.errors");

class TradeService {
  // pagrindine funkcija kuri sukuria kriptovaliuta
  // jei market orderis jis iskart vykdomas
  // jei limit orderis jis laukia kol pasieks reikiama kaina

  async BuyCrypto(
    userId,
    assetId,
    amount,
    ord_direct,
    ord_type,
    ord_status,
    limitPrice = null
  ) {
    const existingAsset = await asset.findOne({ where: { id: assetId } });

    // tikriname ar egzistuoja tokia valiuta
    if (!existingAsset) {
      throw ApiError.ConflictError("Asset not found");
    }
    // gauname dabartine kaina
    const marketPrice = parseFloat(existingAsset.priceUsd);

    let priceChecker;
    // jei order market naudojame dabartine kaina uzsakymui
    if (ord_type === "market") {
      priceChecker = marketPrice * amount;
      // jei limit orderis naudojame vartotojo pasirinkta kaina
    } else if (ord_type === "limit") {
      if (!limitPrice || limitPrice <= 0) {
        throw ApiError.BadRequest("Limit order must have a valid price");
      }
      priceChecker = parseFloat(limitPrice) * amount;
    }

    // tikrina jog reiksme butu tik buy or sell
    if(!["buy", "sell"].includes(ord_direct)){
      throw ApiError.BadRequest("Order must be buy or sell");
    }

    // transakcija
    const transaction = await sequelize.transaction();

    try {
      const newOrder = await transactions.create(
        {
          user_id: userId,
          asset_id: assetId,
          ord_direct,
          ord_status,
          ord_type,
          amount,
          price: ord_direct === "buy" ? -priceChecker : "+" + priceChecker,
        },
        { transaction }
      );

      // jei uzsakymas market vykdome ji iskarto
      if (ord_type === "market") {
        await this.marketOrder(newOrder, transaction);
      } else {
        // jei uzsakymas order pridedame ji i laukianciuju sarasa
        await this.limitOrder(assetId);
      }

      // uzbaigiame transakcija
      await transaction.commit();

      return { message: `Succesfully buyed ${amount} amount of ${assetId}` };
    } catch (err) {
      await transaction.rollback();
      throw ApiError.BadRequest(`Transaction failed: ${err.message}`);
    }
  }

  async marketOrder(order, transaction) {
    // jei parduoda uzdaro statusa closed
    if (order.ord_direct === "sell") {
      await order.update({ ord_status: "closed" }, { transaction });
    }
    await this.updateUserPortfolio(
      order.user_id,
      order.asset_id,
      order.amount,
      order.ord_direct,
      transaction
    );
  }

  // tikrina limit orderius 
  // prides i laukiamuju sarasa ir ivykdys kurie pasieke kainos riba.
  async limitOrder(assetId) {
    try {
      // isgauname visus laukiancius limit orderius
      const pendingOrders = await transactions.findAll({
        where: { ord_status: "open", ord_type: "limit", asset_id: assetId },
      });
      // jei ju nera nutraukiame paieska
      if (!pendingOrders.length) return;

      // surandame valiutos kaina
      const assetData = await asset.findOne({ where: { id: assetId } });
      if (!assetData) return;
      const marketPrice = parseFloat(assetData.priceUsd);

      // iteruojame per visus laukiancius orderius
      for (const order of pendingOrders) {
        const orderPrice = parseFloat(order.price);

        // jei orderis pasieke kaina, vykdom ja
        if (
          (order.ord_direct === "buy" && marketPrice <= orderPrice) ||
          (order.ord_direct === "sell" && marketPrice >= orderPrice)
        ) {
          const transaction = await sequelize.transaction();
          try {
            await order.update({ ord_status: "closed" }, { transaction });

            await this.updateUserPortfolio(
              order.user_id,
              assetId,
              order.amount,
              order.ord_direct,
              transaction
            );

            await transaction.commit();
          } catch (err) {
            await transaction.rollback();
            throw new Error(
              `Error executing order ${order.id}: ${err.message}`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error processing limit orders:", error.message);
    }
  }

  // updatiname vartotojo portfolio po pirkimo/pardavimo ivesties
  async updateUserPortfolio(userId, assetId, amount, ordDirect, transaction) {
    console.log(
      "Checking portfolio for userId:",
      userId,
      "and assetId:",
      assetId
    );
    const userPortfolio = await portfolio.findOne({
      where: { user_id: userId, asset_id: assetId },
    });

    console.log("Useris rastas", userPortfolio);

    if (ordDirect === "buy") {
      if (userPortfolio) {
        await userPortfolio.update(
          { amount: userPortfolio.amount + amount },
          { transaction }
        );
      } else {
        await portfolio.create(
          { user_id: userId, asset_id: assetId, amount },
          { transaction }
        );
      }
    } else if (ordDirect === "sell") {
      if (userPortfolio && userPortfolio.amount >= amount) {
        await userPortfolio.update(
          { amount: userPortfolio.amount - amount },
          { transaction }
        );
      } else {
        throw new Error("Not enough assets to sell");
      }
    }
  }
}

module.exports = new TradeService();
