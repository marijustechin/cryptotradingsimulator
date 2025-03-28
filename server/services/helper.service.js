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
        id: 'BTCUSDT',
        name: 'Bitcoin',
        code: 'BTC',
        icon: 'http://localhost:3003/public/assets/bitcoin-icon.png',
      },
      {
        id: 'ETHUSDT',
        name: 'Ethereum',
        code: 'ETH',
        icon: 'http://localhost:3003/public/assets/ethereum-icon.png',
      },
      {
        id: 'SOLUSDT',
        name: 'Solana',
        code: 'SOL',
        icon: 'http://localhost:3003/public/assets/solana-icon.png',
      },
    ];

    await instrument.bulkCreate(instruments);
  }
}

module.exports = new HelperService();
