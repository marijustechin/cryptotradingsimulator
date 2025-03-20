const axios = require("axios");
const $api = require("../config/axios");
const cryptoWSService = require("./crypto.ws.service");
const assetService = require("./asset.service");
const TradeService = require("./trade.service");

const API_URL = "/assets";
const POPULAR_CRYPTOS = [
  "bitcoin",
  "ethereum",
  "tether",
  "xrp",
  "binance-coin",
  "solana",
  "usd-coin",
  "cardano",
  "dogecoin",
  "tron",
];
const fetchCryptoData = async () => {
  try {
    const cryptoIds = POPULAR_CRYPTOS.join(",");
    const response = await $api.get(`${API_URL}?ids=${cryptoIds}`);

    // bandom irasyti duomenis i db
    await assetService.updateAssets(response.data.data);

    // Transliuojam duomenis visiem klientams
    cryptoWSService.broadcastData(response.data.data);

    // jog atnaujintu limitOrder
    // kas karta kai duomenys pasikeicia
    for (const crypto of response.data.data) {
      await TradeService.limitOrder(crypto.id);
    }
    console.log("gavau duomenis...");
    console.log(response.data.data[0]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response.data);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log("Unexpected error: ", error);
    }
  }
};

// Periodiniai atnaujinimai
// ************************
// kainos
setInterval(fetchCryptoData, 5 * 60 * 1000);

module.exports = { fetchCryptoData };
