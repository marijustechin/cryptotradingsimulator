const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { transactions, portfolio, wallet, instrument } = sequelize.models;
const ApiError = require("../exceptions/api.errors");
const { nanoid } = require("nanoid");
const ProfitService = require("./profit.service");

class TradeService {
  async BuyCrypto(userId, assetId, amount, ord_direct, ord_type, price = null) {
    const transaction = await sequelize.transaction();

    try {
      const newOrder = await this.createTransaction(
        userId,
        assetId,
        amount,
        ord_direct,
        ord_type,
        price,
        transaction
      );

      if (ord_type === "market") {
        await this.marketOrder(
          userId,
          assetId,
          amount,
          ord_direct,
          transaction,
          newOrder
        );
      }
      await transaction.commit();
      return {
        message: `Your entire order has been filled \n Bought ${amount} ${assetId} contracts at market price`,
      };
    } catch (err) {
      await transaction.rollback();
      throw new Error(`Transaction failed: ${err.message}`);
    }
  }

  async marketOrder(userId, assetId, amount, ord_direct, transaction) {
    try {
      const assetData = await instrument.findOne({ where: { id: assetId } });
      if (!assetData) {
        throw new Error(`Asset not found ${assetId}`);
      }

      const marketPrice = PriceService.getPrice(assetId);
      const totalCost = marketPrice * amount;

      await this.updateUserWallet(userId, totalCost, ord_direct, transaction);
      await this.updateUserPortfolio(
        userId,
        assetId,
        amount,
        ord_direct,
        transaction
      );
    } catch (error) {
      await transaction.rollback();
      console.error("There was a error with marketOrder", error);
      throw error;
    }
  }

  async limitOrder(assetId) {
    try {
      const pendingOrders = await transactions.findAll({
        where: {
          ord_direct: { [Op.in]: ["buy", "sell"] },
          ord_type: "limit",
          ord_status: "open",
          asset_id: assetId,
        },
      });

      if (!pendingOrders.length) return;

      const assetData = await instrument.findOne({ where: { id: assetId } });
      if (!assetData) return;
      const marketPrice = parseFloat(assetData.priceUsd);

      for (const order of pendingOrders) {
        const orderPrice = parseFloat(order.order_value);

        if (
          (order.ord_direct === "buy" && marketPrice < orderPrice) ||
          (order.ord_direct === "sell" && marketPrice >= orderPrice)
        ) {
          const transaction = await sequelize.transaction();
          try {
            await order.update({ ord_status: "filled" }, { transaction });

            if (order.ord_direct === "sell") {
              await this.updateUserWallet(
                order.user_id,
                order.total_value,
                order.ord_direct,
                transaction
              );
            }

            await this.updateUserPortfolio(
              order.user_id,
              order.asset_id,
              order.amount,
              order.ord_direct,
              transaction
            );
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

  async updateUserPortfolio(userId, assetId, amount, ordDirect, transaction) {
    const userPortfolio = await portfolio.findOne({
      where: { user_id: userId, asset_id: assetId },
      transaction,
    });

    if (ordDirect === "buy") {
      const newAmount = userPortfolio
        ? parseFloat(userPortfolio.amount) + parseFloat(amount)
        : amount;
      if (userPortfolio) {
        await userPortfolio.update({ amount: newAmount }, { transaction });
      } else {
        await portfolio.create(
          { user_id: userId, asset_id: assetId, amount },
          { transaction }
        );
      }
    } else if (ordDirect === "sell") {
      if (!userPortfolio || parseFloat(userPortfolio.amount) < amount) {
        throw ApiError.BadRequest("Insufficient assets to sell");
      }

      const newAmount = parseFloat(userPortfolio.amount) - parseFloat(amount);

      if (newAmount === 0) {
        await userPortfolio.destroy({ transaction });
      } else {
        await userPortfolio.update({ amount: newAmount }, { transaction });
      }
    }
  }

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

  async createTransaction(
    userId,
    assetId,
    amount,
    ord_direct,
    ord_type,
    price,
    transaction
  ) {
    try {
      const assetData = await instrument.findOne({ where: { id: assetId } });
  
      if (!assetData) {
        throw new Error(`Asset not found: ${assetId}`);
      }
  
      console.log("Checking asset in DB:", assetId);
      console.log("Asset found in DB:", assetData);
  
      if (!price || isNaN(price)) {
        throw new Error("Invalid price provided");
      }
  
      if (amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
  
      const finalPrice = parseFloat(price);
      console.log("FinalPrice", finalPrice);
  
      const totalValue = finalPrice * amount;
      console.log("Totali kaina", totalValue);
  
      const orderID = nanoid(6).toUpperCase();
  
      let ord_status = "open";
      if (ord_type === "market" && ord_direct === "sell") {
        ord_status = "closed";
      }
  
      const newOrder = await transactions.create(
        {
          user_id: userId,
          asset_id: assetId,
          ord_direct,
          ord_status,
          ord_type,
          amount,
          entry_price: finalPrice,
          total_value: totalValue,
          price_usd: finalPrice, // jeigu nori rodyti USD – naudoji šitą kainą
          open_date: ord_direct === "buy" ? new Date() : null,
          closed_date:
            ord_direct === "sell" && ord_type === "market" ? new Date() : null,
          orderID,
        },
        { transaction }
      );
  
      console.log("Orderis sukurtas", newOrder);
  
      // jei parduodam, paskaičiuojam pelną
      if (ord_direct === "sell") {
        const countProfit = await ProfitService.countUserProfit(
          userId,
          assetId,
          amount
        );
  
        await transactions.update(
          { profit: countProfit },
          {
            where: { id: newOrder.id },
            transaction,
          }
        );
      }
  
      return newOrder;
    } catch (error) {
      console.error("createTransaction error:", error.message);
      throw error;
    }
  }
}

module.exports = new TradeService();
