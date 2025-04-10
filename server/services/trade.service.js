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
      let cost;
      if (ord_type === 'market') {
        cost = price * amount;
      } else if(ord_type === "limit") {
        cost = triggerPrice * amount;
      }
      let fee = 0;

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
      if (ord_direct === 'buy') {
        fee = ord_type === 'market' ? cost * 0.015 : cost * 0.0045;
        userWallet.balance = parseFloat(userWallet.balance) - cost - fee;
        await userWallet.save({ transaction });
      }

      await userWallet.save({ transaction });
      // 2. Create order
      const isInstantExecution =
        ord_type === 'market' ||
        (ord_type === 'limit' && price === triggerPrice);

      // kai limit naudoji triggerPrice if statement,
      // kai operacija ivyksta
      // price turi buti = triggerPrice
      // kai market naudoji marketPrice

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
          fee,
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

      if (ord_type === 'market' && ord_direct === 'buy') {
        return {
          message: `Your entire order has been filled\nBought ${amount} ${assetId} at $${price}`,
        };
      } else if (ord_type === 'market' && ord_direct === 'sell') {
        return {
          message: `Your entire order has been filled\nSold ${amount} ${assetId} contracts at $${price}`,
        };
      }

      if (ord_type === 'limit' && ord_direct === 'buy') {
        return {
          message: `Order Submitted Succesfully\n${amount} ${assetId} will be bought at $${triggerPrice} price`,
        };
      } else if (ord_type === 'market' && ord_direct === 'sell') {
        return {
          message: `Order Submitted Succesfully\n${amount} ${assetId} will be sold at $${triggerPrice} price`,
        };
      }
    } catch (err) {
      await transaction.rollback();
      console.error('ROLLBACK REASON:', err); // issami info apie klaida
      throw new Error(`Transaction failed: ${err.message}`);
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
        if (prices.high >= tp && tp >= prices.low) {
          const transaction = await sequelize.transaction();

          if (order.ord_direct === 'sell') {
            const userWallet = await wallet.findOne({
              where: { user_id: order.userId },
              transaction,
            });

            const orderPrice =
              parseFloat(order.amount) * parseFloat(order.price);

            userWallet.balance = parseFloat(userWallet.balance) + orderPrice;

            console.log('Balansas po pardavimo', userWallet.balance);
            await userWallet.save({ transaction });
          }

          order.ord_status = 'closed';
          order.closed_date = new Date();
          await order.save({ transaction });

          await transaction.commit();
          console.log(`Order ${order.id} closed at ${tp} (${symbol})`);

          break;
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

  async getUserOrders(userId, page = 1, limit = 10) {
    const userOrder = await orders.findAll({ where: { userId } });

    console.log({
      where: { userId },
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    const { count, rows } = await orders.findAndCountAll({
      where: { userId: userId },
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['open_date', 'DESC']],
    });

    if (rows.length < 1) {
      throw ApiError.NoContent();
    }

    const totalPages =
      count % limit === 0
        ? Math.floor(count / limit)
        : Math.floor(count / limit) + 1;

    return {
      totalOrders: count,
      totalPages: totalPages,
      currentPage: Number(page),
      orders: rows,
    };
  }

  async editUserOrder(id, userId, triggerPrice, amount) {
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
    const getTriggerPrice = findOrder.triggerPrice;
    const newPrice = getTriggerPrice * amount;
    const getOrderPrice = findOrder.orderPrice;
    const parsedAmount = Number(amount);
    if (parsedAmount === 1) {
      // jei amount = 1 atstatome i pradine pirkimo kaina;
      const startingPrice = getOrderPrice;
      console.log('Pradine kaina', startingPrice);
      await orders.update(
        { triggerPrice: startingPrice },
        { where: { id }, transaction }
      );
    } else if (amount) {
      // jei keičiamas amount apskaičiuojame automatiškai triggerPrice
      await orders.update(
        { triggerPrice: newPrice },
        { where: { id }, transaction }
      );
    }
    await orders.update(fieldsToUpdate, {
      where: { id },
      transaction,
    });

    // jei naudotojas pakeite kaina i didesne nei buvo nustatyta pradine kaina
    // atimam is balanso
    // jei naudotojas pakeite kaina i mazesne nei buvo nustatyta pradine kaina
    // grazinam i balansa
    // jei pasikeite triggerPrice nuskaiciuojame balansa
    const userWallet = await wallet.findOne({ where: { user_id: userId } });
    const balance = parseFloat(userWallet.balance);
    const oldPrice = parseFloat(getTriggerPrice);
    const tg = parseFloat(triggerPrice);

    // jei naujas triggerPrice mazesnis nei senas grazinam skirtuma
    if (tg < oldPrice) {
      const difference = Number((oldPrice - tg).toFixed(5));
      const updatedBalance = Number((balance + difference).toFixed(5));
      await wallet.update(
        { balance: updatedBalance },
        { where: { user_id: userId } }
      );

      // jei naujas triggerPrice didesnis nei senas papildomai nuskaiciuojam
    } else if (tg > oldPrice) {
      const difference = Number((tg - oldPrice).toFixed(5));
      const updatedBalance = Number((balance - difference).toFixed(5));
      await wallet.update(
        { balance: updatedBalance },
        { where: { user_id: userId } }
      );
    }

    await transaction.commit();
    return `Order was updated succesfully!`;
  }
}

module.exports = new TradeService();
