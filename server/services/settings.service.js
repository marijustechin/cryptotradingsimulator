const sequelize = require('../config/db');
const { settings, instrument, user, orders, userLogs } = sequelize.models;

const axios = require('axios');
const { faker } = require('@faker-js/faker');

const API_URL = 'http://localhost:3003/api/v1/users/registration';

class SystemSettings {
  async generateFakeUsers(usersCount = 100, defaultPassword = 'password1') {
    const NUM_USERS = usersCount;
    let counter = 0;

    const userPromises = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const firstName = faker.person.firstName();
      const email = faker.internet.email().toLowerCase();
      // visiems vienodas slaptažodis - jei norėtusi prisijungti ir patikrinti
      const password = 'naudotojas123';
      userPromises.push(this.registerUser(firstName, email, password));
      counter++;
    }

    await Promise.all(userPromises);
    return `Registered fake users: ${counter}`;
  }

  async registerUser(firstName, email, password) {
    try {
      const response = await axios.post(API_URL, {
        first_name: firstName,
        email: email,
        password: password,
      });
      console.log(`Užregistruotas naudotojas: ${email}`);
      return response.data;
    } catch (error) {
      console.error(
        `Registracijos klaida ${email}:`,
        error.response ? error.response.data : error.message
      );
    }
  }

  async getSettings() {
    let systemSettings = await settings.findOne();

    if (!systemSettings) {
      const defaultSettings = await settings.create({
        limit_order_fee: 0.0015,
        market_order_fee: 0.0045,
      });

      return [defaultSettings];
    }

    return systemSettings;
  }

  getRandomCurrency(items) {
    const randomItem = Math.floor(Math.random() * items.length);
    return items[randomItem].id;
  }

  getRandomCurrencyPrice(item) {
    let min = 0;
    let max = 0;
    switch (item) {
      case 'BTCUSDT':
        min = 70216.9;
        max = 96461.34;
        break;
      case 'ETHUSDT':
        min = 1812.68;
        max = 2830.75;
        break;
      case 'SOLUSDT':
        min = 106.88;
        max = 218.74;
        break;
    }
    const randomPrice = Math.random() * (max - min) + min;

    return randomPrice;
  }

  getRandomDate() {
    const currentDate = new Date();

    // -1 metai nuo dabartines dateos
    const previousDate = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDay(),
      currentDate.getHours(),
      currentDate.getMinutes()
    );

    return new Date(
      previousDate.getTime() +
        Math.random() * (currentDate.getTime() - previousDate.getTime())
    );
  }

  getOrderType() {
    const randomType = Math.round(Math.random() + 1);
    if (randomType === 1) {
      return 'market';
    } else {
      return 'limit';
    }
  }

  async getOrderDirection(userId, assetId) {
    const userAssets = await orders.findOne({
      where: {
        userId,
        assetId,
        ord_status: 'closed',
      },
    });

    if (!userAssets) {
      return { direction: 'buy' };
    } else {
      return {
        direction: 'sell',
        amount: userAssets.amount,
        price: userAssets.price,
      };
    }
  }

  async generateFakeActivity() {
    const symbols = await instrument.findAll();
    const fUsers = await user.findAll({ include: ['wallet'] });
    const fees = await this.getSettings();

    let counter = 0;

    for (const uSer of fUsers) {
      if (uSer.role !== 'ADMIN') {
        counter++;
        if (counter % 7 === 0) continue;

        // pinigines likutis tarp 500-100
        const minBalance = Math.random() * (500 - 100) + 100;

        // naudotojas vykdo pirkimus tol, kol jo pinigineje lieka maziau nei x pinigu
        let userBalance = uSer.wallet.balance;
        while (userBalance > minBalance) {
          const assetId = this.getRandomCurrency(symbols);
          const price = this.getRandomCurrencyPrice(assetId);
          const amount = (uSer.wallet.balance * 0.25) / price;
          const ord_type = this.getOrderType();
          const ord_direct = 'buy';
          const open_date = this.getRandomDate();

          // sandorio tipas?
          if (ord_type === 'market') {
            const fee = amount * price * fees.market_order_fee;
            const closed_date = open_date;

            if (ord_direct === 'buy') {
              await orders.create({
                userId: uSer.id,
                assetId,
                amount,
                ord_direct,
                ord_type,
                ord_status: 'closed',
                price,
                fee,
                open_date,
                closed_date,
              });
              uSer.wallet.balance -= amount * price + fee;
              uSer.wallet.save();
              userBalance -= amount * price + fee;
              await userLogs.create({
                userId: uSer.id,
                ip: `${Math.floor(
                  Math.random() * (255 - 10) + 10
                )}.${Math.floor(Math.random() * (255 - 10) + 10)}.${Math.floor(
                  Math.random() * (255 - 10) + 10
                )}.${Math.floor(Math.random() * (255 - 10) + 10)}`,
                lastLogin: closed_date,
              });
            } else {
              console.log('Parduodam...');
            }
          } else {
            // limit sandoris
            const fee = amount * price * fees.limit_order_fee;
            const tempDate = open_date;
            const closed_date = new Date(
              tempDate.setDate(
                tempDate.getDate() + Math.floor(Math.random() * (5 - 3) + 3)
              )
            );

            const triggerPrice = price - price * 0.03;

            if (ord_direct === 'buy') {
              await orders.create({
                userId: uSer.id,
                assetId,
                amount,
                ord_direct,
                ord_type,
                ord_status: 'closed',
                price,
                triggerPrice,
                fee,
                open_date,
                closed_date,
              });
              uSer.wallet.balance -= amount * price + fee;
              uSer.wallet.save();
              userBalance -= amount * price + fee;
              await userLogs.create({
                userId: uSer.id,
                ip: `${Math.floor(
                  Math.random() * (255 - 10) + 10
                )}.${Math.floor(Math.random() * (255 - 10) + 10)}.${Math.floor(
                  Math.random() * (255 - 10) + 10
                )}.${Math.floor(Math.random() * (255 - 10) + 10)}`,
                lastLogin: closed_date,
              });
            } else {
              console.log('Parduodam...');
            }
          }
        }

        console.log(`[while ciklas] ${userBalance}`);
      }
    }

    return 'Fake activity generated successfully';
  }

  async updateFees(limitFee = null, marketFee = null) {
    const fees = await settings.findOne();
    let message = '';
    if (fees) {
      if (limitFee) {
        fees.limit_order_fee = limitFee;
        message = 'Limit order fee updated';
      }

      if (marketFee) {
        fees.market_order_fee = marketFee;
        message = 'Market order fee updated';
      }

      fees.save();
      return message;
    } else {
      return 'Settings table is empty';
    }
  }
}

module.exports = new SystemSettings();
