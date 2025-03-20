const axios = require('axios');
const $api = require('../config/axios');
const cryptoWSService = require('./crypto.ws.service');
const assetService = require('./asset.service');

const API_URL = '/assets';
const POPULAR_CRYPTOS = [
  'bitcoin',
  'ethereum',
  'tether',
  'xrp',
  'binance-coin',
  'solana',
  'cardano',
  'dogecoin',
  'tron',
  'toncoin',
];

const fetchCryptoData = async () => {
  try {
    const cryptoIds = POPULAR_CRYPTOS.join(',');
    const response = await $api.get(`${API_URL}?ids=${cryptoIds}`);

    // bandom irasyti duomenis i db
    await assetService.updateAssets(response.data.data);

    // Transliuojam duomenis visiem klientams
    console.log('gavau duomenis...');
    cryptoWSService.broadcastData(response.data.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response.data);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log('Unexpected error: ', error);
    }
  }
};

// Periodiniai atnaujinimai
// ************************
// kainos
setInterval(fetchCryptoData, 5 * 60 * 1000);

module.exports = { fetchCryptoData };
