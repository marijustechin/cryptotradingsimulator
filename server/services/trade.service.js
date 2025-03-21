const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { asset, transactions, portfolio, wallet } = sequelize.models;
const ApiError = require("../exceptions/api.errors");

class TradeService {
  // pagrindine funkcija kuri sukuria kriptovaliuta
  // jei market orderis jis iskart vykdomas
  // jei limit orderis jis laukia kol pasieks reikiama kaina

  async BuyCrypto(userId, assetId, amount, ord_direct, ord_type, price = null) {
    
    const transaction = await sequelize.transaction();

    try {
        const newOrder = await this.createTransaction(userId, assetId, amount, ord_direct, ord_type, price, transaction);

        if (ord_type === "market") {
            await this.marketOrder(userId, assetId, amount, ord_direct, transaction, newOrder);
        }
        await transaction.commit();
        return { message: `Your entire order has been filled \n Bought ${amount} ${assetId} contracts at market price` };
    } catch (err) {
        await transaction.rollback();
        throw new Error(`Transaction failed: ${err.message}`);
    }
}
  async marketOrder(userId, assetId, amount, ord_direct, transaction, newOrder) {
  
    const assetData = await asset.findOne({ where: { id: assetId } });
    if (!assetData) {
      throw new Error(`Asset not found ${assetId}`);
    }
  
    const marketPrice = parseFloat(assetData.priceUsd);
    const totalCost = marketPrice * amount;
  
    const userWallet = await wallet.findOne({ where: { user_id: userId } });
    if (!userWallet) {
      throw new Error(`Wallet not found for user ${userId}`);
    }
  
    await this.updateUserWallet(userId, totalCost, ord_direct, transaction);

    if (ord_direct === "buy") {
      await this.updateUserPortfolio(userId, assetId, amount, ord_direct, transaction);
  }

    if (ord_direct === "sell") {
      const existingOrder = await transactions.findOne({ 
        where: { id: newOrder.id }, 
        transaction 
      });
      if (!existingOrder) {
        throw new Error(`Order with ID ${newOrder.id} not found.`);
      }
  
      const userPortfolio = await portfolio.findOne({
        where: { user_id: userId, asset_id: assetId },
        transaction,
      });
  
      if (!userPortfolio || userPortfolio.amount < amount) {
        throw new Error("You don't have assets to sell");
      }
  
      await userPortfolio.update(
        { amount: userPortfolio.amount - amount },
        { transaction }
      );
    }
  
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

            await transaction.commit();

            // updatinam user portfolio
            await this.updateUserPortfolio(
              order.user_id,
              order.asset_id,
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
    const userPortfolio = await portfolio.findOne({
      where: { user_id: userId, asset_id: assetId },
    });

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
  async updateUserWallet(userId, price, ord_direct, transaction = null) {
    const userWallet = await wallet.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (!userWallet) {
      throw new Error(`Wallet not found for user ${userId}`);
    }

    const balance = parseFloat(userWallet.balance);
    const convertedPrice = parseFloat(price);

    if (ord_direct === "buy" && userWallet.balance < price) {
      throw new Error(`Insufficient balance to place ${ord_direct} order`);
    }

    if (ord_direct === "buy") {
      await userWallet.update(
        { balance: balance - convertedPrice },
        { transaction }
      );
    } else if (ord_direct === "sell") {
      await userWallet.update(
        { balance: balance + convertedPrice },
        { transaction }
      );
    }
  }

  async createTransaction(userId, assetId, amount, ord_direct, ord_type, price, transaction) {

    const assetData = await asset.findOne({ where: { id: assetId } });
    if (!assetData) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    const marketPrice = parseFloat(assetData.priceUsd);

    const finalPrice = ord_type === "limit" ? parseFloat(price) : marketPrice;

    let ord_status = "open"; 

    if (ord_type === "market") {
      ord_status = ord_direct === "buy" ? "open" : "closed";
    }
  
    const newOrder = await transactions.create(
      {
        user_id: userId,
        asset_id: assetId,
        ord_direct,
        ord_status,
        ord_type,
        amount,
        price: ord_direct === "buy" ? -finalPrice : +finalPrice,
        order_value: ord_type === "market" ? marketPrice : price,
        open_date: ord_direct === "buy" ? new Date() : null,
        closed_date: ord_direct === "sell" && ord_type === "market" ? new Date() : null,
      },
      { transaction }
    );
  
    if (!newOrder || !newOrder.id) {
      throw new Error("Transaction creation failed");
    }
    return newOrder;
  }
}

module.exports = new TradeService();
