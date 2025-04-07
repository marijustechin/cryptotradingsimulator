const sequelize = require('../config/db');
const { Op } = require('sequelize');
const { orders, wallet, instrument, user } = sequelize.models;
const ApiError = require('../exceptions/api.errors');
const { nanoid } = require('nanoid');
const ProfitService = require('./profit.service');
const helperService = require('./helper.service');
const EmailService = require('./email.service');

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

      // Jei viskas ok, atimam is balanso
      // iskaitant ir mokesti
      const fee = ord_type === 'market' ? cost * 0.015 : cost * 0.0045;
      userWallet.balance = parseFloat(userWallet.balance) - cost - fee;

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
          orderPrice: triggerPrice,
          ord_status,
          open_date: new Date(),
          closed_date,
        },
        { transaction }
      );

      if (isInstantExecution) {
        await EmailService.sendMailer(userId);
      }

      console.log('Turetu issiusti i email');

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
      const tp = order.triggerPrice;
      for (const prices of priceData) {
        // jei triger price yra mazesne uz minutes auksciausia
        // ir didesne uz minutes zemiausia, tada uzdarom sandori
        if (prices.high >= tp && tp >= prices.low) {
          // tada uzdarom sandori
          order.ord_status = 'closed';
          // reikia sutvarkyti laika - kol kas dedamas uzdarymo laikas, o ne kainos intervalo laikas
          order.closed_date = new Date();
          await order.save();
          console.log(`Order ${order.id} closed at ${tp} (${symbol})`);
        }
      }
    }
  }

  async cancelOrder(id, userId) {
    const transaction = await sequelize.transaction();

    // isgauname vartotojo orderi
    // atnaujiname vartotojo balansa
    // istriname orderi

    const getOrder = await orders.findOne({ where: { id } });
    if (!getOrder) {
      throw new Error('Order does not exist');
    }
    const getOrderPrice = parseFloat(getOrder.price);
    const getOrderedAmount = getOrder.amount;

    const orderPrice = getOrderPrice * getOrderedAmount;

    const userWallet = await wallet.findOne({
      where: { user_id: userId },
      transaction,
    });
    const currentBalance = parseFloat(userWallet.balance);

    const refundedBalance = currentBalance + orderPrice;

    await userWallet.update(
      { balance: refundedBalance },
      { where: { user_id: userId }, transaction }
    );

    console.log('Order Cancelled - Money refunded');

    const deletedOrder = await orders.destroy({ where: { id } });

    await transaction.commit();

    return `Order ${id} deleted`;
  }

  async getUserOrders(userId) {
    const userOrder = await orders.findAll({ where: { userId } });

    return userOrder;
  }

  async editUserOrder(id, userId, triggerPrice, amount) {
    // vienas route
    // veikia tik ant limit orderio
    // jei zmogus nori keisti price - keiciasi tik price
    // kai keiciasi price atiduoda arba atiima balansa
    // jei zmogus nori keisti amount - keiciasi tik amount

    // *** CIA REIKS DAPILDYTI VALIDACIJAS, WALLET ATNAUJINIMUS ir t.t *** //
    const transaction = await sequelize.transaction();

    const findOrder = await orders.findOne({
      where: { id, userId: userId },
      transaction,
    });

    if (!findOrder) {
      throw new Error("Order does not exist or it doesn't belong to this user");
    }

    let fieldsToUpdate = {};

    if (triggerPrice !== undefined) fieldsToUpdate.triggerPrice = triggerPrice;
    if (amount !== undefined) fieldsToUpdate.amount = amount;

    // kai vartotojas keicia amount - perskaiciuojame orderio kaina
    // kai vartotojas uzsisako orderPrice pvz : 50$
    // keiciant kieki i 2 orderValue pasikeicia i 100$
    // kai vartotojas nori pakeisti kieki i 1 turetu pasikeisti i pradine kiekio reiksme

    const getTriggerPrice = findTriggerPrice.triggerPrice;
    const newPrice = getTriggerPrice * amount;
    if (amount) {
      await orders.update(
        { triggerPrice: newPrice },
        { where: { id }, transaction }
      );
    }

    await orders.update(fieldsToUpdate, {
      where: { id },
      transaction,
    });

    // await wallet.update({where: {balance:}})

    await transaction.commit();

    return `Order was updated succesfully!`;
  }
}

module.exports = new TradeService();
