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

  formatDate(date) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  async makeFakeOrder() {}
}

module.exports = new HelperService();
