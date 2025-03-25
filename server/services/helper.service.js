const sequelize = require('../config/db');
const { instrument } = sequelize.models;

class HelperService {
  errorsToString(errorsArray) {
    let errorString = '';

    for (const item of errorsArray) {
      errorString += item.msg + '; ';
    }

    return errorString;
  }

  correctDatePrice(histData, interval) {
    const formated = histData.map((item) => ({
      priceUsd: Math.round(parseFloat(item.priceUsd) * 1000) / 1000,
      date: item.date.split('T')[1].slice(0, 5),
      circulatingSupply: item.circulatingSupply,
      time: item.time,
    }));

    return formated;
  }

  async initInstruments() {
    const instruments = [
      {
        id: 'BTC-USD',
        name: 'Bitcoin',
        code: 'BTC',
        icon: 'http://localhost:3003/public/assets/bitcoin-icon.png',
      },
      {
        id: 'ETH-USD',
        name: 'Ethereum',
        code: 'ETH',
        icon: 'http://localhost:3003/public/assets/ethereum-icon.png',
      },
      {
        id: 'USDT-USD',
        name: 'Tether',
        code: 'USDT',
        icon: 'http://localhost:3003/public/assets/tether-icon.png',
      },
      {
        id: 'XRP-USD',
        name: 'XRP',
        code: 'XRP',
        icon: 'http://localhost:3003/public/assets/xrp-icon.png',
      },
      {
        id: 'SOL-USD',
        name: 'Solana',
        code: 'BTC',
        icon: 'http://localhost:3003/public/assets/solana-icon.png',
      },
      {
        id: 'ADA-USD',
        name: 'Cardano',
        code: 'ADA',
        icon: 'http://localhost:3003/public/assets/cardano-icon.png',
      },
      {
        id: 'LINK-USD',
        name: 'Chainlink',
        code: 'BTC',
        icon: 'http://localhost:3003/public/assets/chainlink-icon.png',
      },
      {
        id: 'DOGE-USD',
        name: 'Dogecoin',
        code: 'DOGE',
        icon: 'http://localhost:3003/public/assets/dogecoin-icon.png',
      },
      {
        id: 'TRX-USD',
        name: 'Tron',
        code: 'TRX',
        icon: 'http://localhost:3003/public/assets/trx-icon.png',
      },
      {
        id: 'TON-USD',
        name: 'Toncoin',
        code: 'TON',
        icon: 'http://localhost:3003/public/assets/toncoin-icon.png',
      },
      {
        id: 'LEO-USD',
        name: 'LEO Token',
        code: 'XLM',
        icon: 'http://localhost:3003/public/assets/leo-icon.png',
      },
    ];

    await instrument.bulkCreate(instruments);
  }
}

module.exports = new HelperService();
