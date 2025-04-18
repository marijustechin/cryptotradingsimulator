const sequelize = require('../config/db');
const { Op } = require('sequelize');
const { orders, wallet, instrument, settings, user } = sequelize.models;
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
      const systemSettings = await settings.findOne();
      const cost =
        ord_type === 'market' ? price * amount : triggerPrice * amount;

      const fee =
        ord_type === 'market'
          ? cost * systemSettings.market_order_fee
          : cost * systemSettings.limit_order_fee;

      const userWallet = await wallet.findOne({
        where: { user_id: userId },
        transaction,
      });

      if (!userWallet) {
        throw new Error('Wallet not found for user');
      }

      if (ord_direct === 'buy') {
        userWallet.balance = parseFloat(userWallet.balance) - cost - fee;
      } else if (ord_direct === 'sell') {
        userWallet.balance = parseFloat(userWallet.balance) + cost - fee;
      }

      await userWallet.save({ transaction });

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
      } else if (ord_type === 'limit' && ord_direct === 'sell') {
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
    const systemSettings = await settings.findOne();
    const transaction = await sequelize.transaction();

    // isgauname vartotojo orderi
    // atnaujiname vartotojo balansa
    // istriname orderi

    const getOrder = await orders.findOne({ where: { id } });
    if (!getOrder) {
      throw new Error('Order does not exist');
    }
    const getOrderPrice = parseFloat(getOrder.triggerPrice);
    const getOrderedAmount = getOrder.amount;

    const orderPrice = getOrderPrice * getOrderedAmount;

    const userWallet = await wallet.findOne({
      where: { user_id: userId },
      transaction,
    });
    const currentBalance = parseFloat(userWallet.balance);

    const refundedBalance =
      currentBalance + orderPrice + orderPrice * systemSettings.limit_order_fee;

    await userWallet.update(
      { balance: refundedBalance },
      { where: { user_id: userId }, transaction }
    );

    await orders.destroy({ where: { id } });

    await transaction.commit();

    return `Order ${id} deleted`;
  }

  async getUserOrders(userId, page = 1, limit = 10) {
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

    // kai vartotojas keicia amount arba triggerPrice - perskaiciuojame orderPrice
    const getTriggerPrice = findOrder.triggerPrice;
    const parsedAmount = Number(amount);
    const newTriggerPrice = triggerPrice !== undefined ? parseFloat(triggerPrice) : getTriggerPrice;
    const newAmount = amount !== undefined ? parsedAmount : parseFloat(findOrder.amount);

    // Apskaičiuojame naują orderPrice (kaina * kiekis)
    const newOrderPrice = newTriggerPrice * newAmount;

    // Atnaujiname orderPrice lauką
    await orders.update(
      { orderPrice: newOrderPrice },
      { where: { id }, transaction }
    );

    // Recalculate the fee based on the new order details
    const systemSettings = await settings.findOne();
    const cost = newTriggerPrice * newAmount;
    const fee = newAmount > 0 ? cost * systemSettings.limit_order_fee : 0;

    await orders.update(fieldsToUpdate, {
      where: { id },
      transaction,
    });

    // jei naudotojas pakeite kaina i didesne nei buvo nustatyta pradine kaina
    // atimam is balanso
    // jei naudotojas pakeite kaina i mazesne nei buvo nustatyta pradine kaina
    // grazinam i balansa
    // jei pasikeite triggerPrice nuskaiciuojame balansa
    const userWallet = await wallet.findOne({ where: { user_id: userId }, transaction });
    const balance = parseFloat(userWallet.balance);

    // Gauname senus ir naujus užsakymo kiekius bei kainas
    const oldAmount = parseFloat(findOrder.amount);
    const oldTriggerPrice = parseFloat(findOrder.triggerPrice);

    // Apskaičiuojame senos ir naujos užsakymo vertes bei jų skirtumą
    const oldOrderValue = oldAmount * oldTriggerPrice;
    const newOrderValue = newAmount * newTriggerPrice;
    const difference = newOrderValue - oldOrderValue;

    // Jei užsakymo vertė padidėjo, tikriname likutį ir nuskaityme skirtumą
    if (difference > 0) {
      if (balance < difference + fee) {
          throw new Error('Nepakanka lėšų atnaujinti užsakymą');
      }
      userWallet.balance = balance - (difference + fee);
      await userWallet.save({ transaction });
  } else if (difference < 0) {
      // Jei užsakymo vertė sumažėjo, grąžiname skirtumą į piniginę
      userWallet.balance = balance + Math.abs(difference);
      await userWallet.save({ transaction });
  }

  await transaction.commit();
  return `Order was updated successfully!`;
  }
}

module.exports = new TradeService();
