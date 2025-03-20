const sequelize = require("../config/db");
const { Op } = require("sequelize");
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
    price = null
  ) {
    const existingAsset = await asset.findOne({ where: { id: assetId } });

    // tikriname ar egzistuoja tokia valiuta
    if (!existingAsset) {
      throw ApiError.ConflictError("Asset not found");
    }

    if (ord_direct === "sell") {
      const userPortfolio = await portfolio.findOne({
        where: { user_id: userId, asset_id: assetId },
      });

      if (!userPortfolio || userPortfolio.amount < amount) {
        throw ApiError.BadRequest("You must have asset to sell");
      }
    }

    // gauname dabartine kaina ir paverciame ji i skaiciu
    const marketPrice = parseFloat(existingAsset.priceUsd);

    let priceChecker;
    // jei order market naudojame dabartine kaina uzsakymui
    if (ord_type === "market") {
      priceChecker = marketPrice * amount;
      // jei limit orderis naudojame vartotojo pasirinkta kaina
    } else if (ord_type === "limit") {
      if (!price || price <= 0) {
        throw ApiError.BadRequest(
          "Limit order must have a valid price. Required field price"
        );
      }
      priceChecker = parseFloat(price) * amount;
    }

    // tikrina jog reiksme butu tik buy or sell
    if (!["buy", "sell"].includes(ord_direct)) {
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
          order_value: price,
          open_date: ord_direct === "buy" ? new Date() : null,
          closed_date: ord_direct === "sell" ? new Date() : null,
        },
        { transaction }
      );

      // jei uzsakymas market vykdome ji iskarto
      if (ord_type === "market") {
        if (ord_direct === "buy") {
          await this.marketOrder(newOrder, transaction);
          return {
            message: `Your entire order has been filled \n Bought ${amount} ${assetId} contracts at market price`,
          };
        } else if (ord_direct === "sell") {
          await this.marketOrder(newOrder, transaction);
          // uzbaigiame transakcija
          await transaction.commit();
          return {
            message: `Your entire order has been filled \n Sold ${amount} ${assetId} contracts at market price`,
          };
        }
      }

      // jei limit uzsakymas
      if (ord_type === "limit") {
        if (ord_direct === "buy") {
          await this.updateUserWallet(userId, price, ord_direct, ord_status);
          await this.limitOrder(assetId, price, amount);
          await transaction.commit();
          return {
            message: `${amount} ${assetId} contracts will be bought at ${price}`,
          };
        } else if (ord_direct === "sell") {
          await this.limitOrder(assetId, price, amount);
          // uzbaigiame transakcija
          await transaction.commit();
          return {
            message: `${amount} ${assetId} contracts will be sold at ${price}`,
          };
        }
      }

      return { message: `Succesfully buyed ${amount} amount of ${assetId}` };
    } catch (err) {
      await transaction.rollback();
      throw ApiError.BadRequest(`Transaction failed: ${err.message}`);
    }
  }

  async marketOrder(order, transaction) {
    // jei parduoda uzdaro statusa closed
    await order.update({ ord_status: "closed" }, { transaction });
    await this.updateUserPortfolio(
      order.user_id,
      order.asset_id,
      order.amount,
      transaction
    );
  }

  // tikrina limit orderius
  // prides i laukiamuju sarasa ir ivykdys kurie pasieke kainos riba.
  async limitOrder(assetId) {
    try {
      // isgauname visus laukiancius limit orderius
      const pendingOrders = await transactions.findAll({
        where: {
          ord_direct: { [Op.in]: ["buy", "sell"] },
          ord_type: "limit",
          ord_status: "open",
          asset_id: assetId,
        },
      });

      // jei pendingOpen nera nutraukiame paieska
      if (!pendingOrders.length) return;

      // surandame valiutos kaina
      const assetData = await asset.findOne({ where: { id: assetId } });
      if (!assetData) return;
      const marketPrice = parseFloat(assetData.priceUsd);

      // iteruojame per visus laukiancius orderius
      for (const order of pendingOrders) {
        const orderPrice = parseFloat(order.order_value);

        // jei orderis pasieke kaina, vykdom ja

        if (
          (order.ord_direct === "buy" && marketPrice < orderPrice) ||
          (order.ord_direct === "sell" && marketPrice >= orderPrice)
        ) {
          const transaction = await sequelize.transaction();
          try {
            await order.update({ ord_status: "filled" }, { transaction });

            // pridedam balansa po ord_status filled
            if (order.ord_direct === "sell") {
              await this.updateUserWallet(
                order.user_id,
                order.price,
                order.ord_direct,
                transaction
              );
            }

            // updatinam user portfolio
            await this.updateUserPortfolio(
              order.user_id,
              order.asset_id,
              order.amount,
              order.ord_direct,
              transaction
            );

            await transaction.commit();
            console.log(`Transaction succesfully commited`);
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
    const userPortfolio = await portfolio.findOne({
      where: { user_id: userId, asset_id: assetId },
    });

    console.log("Useris rastas:", userPortfolio);

    if (ordDirect === "buy") {
      if (userPortfolio) {
        console.log("Updating existing portfolio");
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
        throw new Error("You don't have assets to sell");
      }
    }
  }

  // updatinam userio wallet
  async updateUserWallet(userId, price, ord_direct) {
    const userWallet = await wallet.findOne({ where: { user_id: userId } });

    if (!userWallet) {
      throw new Error(`Wallet not found for user ${userId}`);
    }

    if (userWallet.balance < price) {
      throw new Error(`Insufficient balance to place ${ord_direct} order`);
    }

    const balance = parseFloat(userWallet.balance);
    const convertedPrice = parseFloat(price);

    if (ord_direct === "buy") {
      await userWallet.update({ balance: balance - convertedPrice });
    } else if (ord_direct === "sell") {
      await userWallet.update({ balance: balance + convertedPrice });
    }
  }
}

module.exports = new TradeService();
