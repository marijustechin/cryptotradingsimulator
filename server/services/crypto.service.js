//const axios = require('axios');
//const { Crypto } = require('../models/crypto.model');
const { broadcastData } = require('./crypto.ws.service');

const API_URL = 'https://api.coincap.io/v2/assets';
const API_KEY = process.env.COINCAP_API_KEY;

const fetchCryptoData = async () => {
  try {
    // const response = await axios.get(API_URL, {
    //   headers: { Authorization: `Bearer ${API_KEY}` },
    // });

    // const topCurrencies = response.data.data
    //   .filter((crypto) =>
    //     ['bitcoin', 'ethereum', 'cardano'].includes(crypto.id)
    //   ) // Example top 10 filtering
    //   .map(({ id, name, priceUsd, marketCapUsd }) => ({
    //     id,
    //     name,
    //     price: parseFloat(priceUsd),
    //     marketCap: parseFloat(marketCapUsd),
    //   }));

    // // Store in DB (upsert logic)
    // for (const crypto of topCurrencies) {
    //   await Crypto.upsert(crypto);
    // }

    // Broadcast new data
    broadcastData(`Nauji duomenys: ${new Date()}`);
    console.log(`Cia turi buti perduodami duomenys: ${new Date()}`);
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
  }
};

// Schedule periodic updates
setInterval(fetchCryptoData, 1 * 60 * 1000);

module.exports = { fetchCryptoData };
