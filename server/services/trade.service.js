const sequelize = require('../config/db');
const { Op } = require('sequelize');
const { orders, wallet, instrument } = sequelize.models;
const ApiError = require('../exceptions/api.errors');
const { nanoid } = require('nanoid');
const ProfitService = require('./profit.service');
const helperService = require('./helper.service');

class TradeService {
  async buyCrypto(
    userId,
    assetId,
    amount,
    ord_direct,
    ord_type,
    price,
    triggerPrice
  ) {
    const transaction = await sequelize.transaction();

    try {
      const cost = price * amount;

      // 1. Nuskaiciuojam kapeikas
      const userWallet = await wallet.findOne({
        where: { user_id: userId },
        transaction,
      });

      if (!userWallet) {
        throw new Error('Wallet not found for user');
      }

      if (parseFloat(userWallet.balance) < cost) {
        throw new Error('Insufficient balance');
      }

      // Jei viskas ok, atimam
      userWallet.balance = parseFloat(userWallet.balance) - cost;

      await userWallet.save({ transaction });

      // 2. Create order
      const isInstantExecution =
        ord_type === 'market' ||
        (ord_type === 'limit' && price === triggerPrice);

      const ord_status = isInstantExecution ? 'closed' : 'open';
      const closed_date = isInstantExecution ? new Date() : null;
      await orders.create(
        {
          userId,
          assetId,
          amount,
          ord_direct,
          ord_type,
          price,
          triggerPrice,
          ord_status,
          open_date: new Date(),
          closed_date,
        },
        { transaction }
      );

      // 3. komitinam
      await transaction.commit();

      return {
        message: `Your entire order has been filled\nBought ${amount} ${assetId} at $${price}`,
      };
    } catch (err) {
      await transaction.rollback();
      console.error('ROLLBACK REASON:', err); // issami info apie klaida
      throw new Error(`Transaction failed: ${err.message}`);
    }
  }

  async marketOrder(userId, assetId, price, amount, ord_direct, transaction) {
    try {
      const assetData = await instrument.findOne({ where: { id: assetId } });
      if (!assetData) {
        throw new Error(`Asset not found ${assetId}`);
      }
      const totalCost = price * amount;

      if (!userId) {
        throw new Error('userId is undefined in updateUserWallet');
      }

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
      console.error('There was a error with marketOrder', error);
      throw error;
    }
  }

  async limitOrder(assetId, marketPrice) {
    try {
      const pendingOrders = await transactions.findAll({
        where: {
          ord_direct: { [Op.in]: ['buy', 'sell'] },
          ord_type: 'limit',
          ord_status: 'open',
          asset_id: assetId,
        },
      });

      if (!pendingOrders.length) return;

      for (const order of pendingOrders) {
        const orderPrice = parseFloat(order.order_value);

        if (
          (order.ord_direct === 'buy' && marketPrice <= orderPrice) ||
          (order.ord_direct === 'sell' && marketPrice >= orderPrice)
        ) {
          const transaction = await sequelize.transaction();

          try {
            await order.update({ ord_status: 'filled' }, { transaction });

            if (order.ord_direct === 'sell') {
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

            await transaction.commit();
            console.log(`Limit order ${order.id} filled`);
          } catch (err) {
            await transaction.rollback();
            throw new Error(
              `Error executing order ${order.id}: ${err.message}`
            );
          }
        }
      }
    } catch (error) {
      console.error('Error processing limit orders:', error.message);
    }
  }

  async updateUserPortfolio(userId, assetId, amount, ordDirect, transaction) {
    const userPortfolio = await portfolio.findOne({
      where: { user_id: userId, asset_id: assetId },
      transaction,
    });

    if (ordDirect === 'buy') {
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
    } else if (ordDirect === 'sell') {
      if (!userPortfolio || parseFloat(userPortfolio.amount) < amount) {
        throw ApiError.BadRequest('Insufficient assets to sell');
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

    if (ord_direct === 'buy' && userWallet.balance < price) {
      throw ApiError.BadRequest(
        `Insufficient balance to place ${ord_direct} order`
      );
    }

    if (ord_direct === 'buy') {
      await userWallet.update(
        { balance: balance - convertedPrice },
        { transaction }
      );
    } else if (ord_direct === 'sell') {
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

      if (!price || isNaN(price)) {
        throw new Error('Invalid price provided');
      }

      if (amount <= 0) {
        throw new Error('Please enter amount');
      }

      const finalPrice = parseFloat(price);

      const totalValue = finalPrice * amount;

      const orderID = nanoid(6).toUpperCase();

      let ord_status = 'open';
      if (ord_type === 'market' && ord_direct === 'sell') {
        ord_status = 'closed';
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
          price_usd: finalPrice,
          open_date: ord_direct === 'buy' ? new Date() : null,
          closed_date:
            ord_direct === 'sell' && ord_type === 'market' ? new Date() : null,
          orderID,
        },
        { transaction }
      );

      if (ord_direct === 'sell') {
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
      console.error('createTransaction error:', error.message);
      throw error;
    }
  }

  async getOpenOrders(userId) {
    const openOrders = await orders.findAll({
      where: {
        userId: userId,
        ord_status: 'open',
      },
      attributes: [
        'id',
        'amount',
        'ord_direct',
        'ord_type',
        'price',
        'triggerPrice',
        'open_date',
      ],
      include: [
        {
          model: instrument,
          attributes: ['name'],
        },
      ],
    });

    const result = openOrders.map((order) => {
      const raw = order.toJSON();

      return {
        id: raw.id,
        amount: raw.amount,
        ord_direct: raw.ord_direct,
        ord_type: raw.ord_type,
        price: raw.price,
        triggerPrice: raw.triggerPrice,
        open_date: helperService.formatDate(raw.open_date),
        assetName: raw.instrument.name,
      };
    });

    return result;
  }

  async getUserAssets(userId) {
    const orders = await sequelize.models.orders.findAll({
      where: {
        userId,
        ord_status: 'closed',
      },
      raw: true,
    });

    const assets = {};

    for (const order of orders) {
      const asset = order.assetId;

      if (!assets[asset]) {
        assets[asset] = {
          balance: 0,
          totalBuyCost: 0, // USD spent
          totalBuyAmount: 0,
          totalSellAmount: 0,
        };
      }

      const amount = parseFloat(order.amount);
      const price = parseFloat(order.price || 0); // fallback if null

      if (order.ord_direct === 'buy') {
        assets[asset].balance += amount;
        assets[asset].totalBuyAmount += amount;
        assets[asset].totalBuyCost += amount * price;
      } else if (order.ord_direct === 'sell') {
        assets[asset].balance -= amount;
        assets[asset].totalSellAmount += amount;
      }
    }

    // Final result per asset
    const result = Object.entries(assets).map(([asset, data]) => {
      const avgBuyPrice =
        data.totalBuyAmount > 0 ? data.totalBuyCost / data.totalBuyAmount : 0;

      return {
        asset,
        balance: data.balance,
        spotCost: data.totalBuyCost, // total spent
        avgBuyPrice: avgBuyPrice.toFixed(2),
      };
    });

    return result;
  }

  /**
   * 
   * @param {*} priceData  array of {   time: unix timestamp,
      open: number,
      high: number,
      low: number,
      close: number}
   */
  async checkAndCloseOrders(symbol, priceData) {
    // select limit open orders of given symbol
    const selectedOrders = await orders.findAll({
      where: {
        ord_status: 'open',
        assetId: symbol,
        ord_type: 'limit',
      },
    });

    for (const order of selectedOrders) {
      const closestPrice = helperService.getClosestPriceMatch(
        order.triggerPrice,
        priceData
      );
      const diff = Math.abs(closestPrice - order.triggerPrice);

      // pagal viska skirtumas turetu buti nedidelis
      // jei ka, tai galima pareguliuoti
      if (diff < 0.01) {
        order.status = 'closed';
        order.closed_date = new Date(priceData.timestamp);
        await order.save();
        console.log(`Order ${order.id} closed at ${closestPrice} (${symbol})`);
      }
    }
  }

  async cancelOrder(id) {
    const deletedOrder = await orders.destroy({ where: { id } });

    return `Order ${id} deleted`;
  }

  async getUserOrders(userId) {
    const userOrder = await orders.findAll({where: {userId}});
    
    return userOrder;
  }
}

module.exports = new TradeService();
