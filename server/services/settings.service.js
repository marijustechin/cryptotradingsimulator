const sequelize = require('../config/db');
const { settings, instrument, user } = sequelize.models;

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

    if (systemSettings.length === 0) {
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
    return items[randomItem];
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
    const start = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    );
    const end = new Date();
    const date = new Date(+start + Math.random() * (end - start));

    return date;
  }

  async generateFakeActivity() {
    const symbols = await instrument.findAll();
    const fUsers = await user.findAll({ include: ['wallet'] });

    for (const uSer of fUsers) {
      const currency = this.getRandomCurrency(symbols);
      const currencyPrice = this.getRandomCurrencyPrice(currency.id);
      const openDate = this.getRandomDate();
      const closeDate = openDate;
      closeDate.setDate(closeDate.getDate() + Math.floor(Math.random() * 10));
      console.log(
        `${currency.id} ${currencyPrice} \n ${openDate} ${closeDate}`
      );
    }

    return 'fake activity generated';
  }
}

module.exports = new SystemSettings();
