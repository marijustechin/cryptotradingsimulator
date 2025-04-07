const sequelize = require('../config/db');
const { user, userLogs, orders } = sequelize.models;

class AdminService {
  async getGeneralData() {
    // count all users
    const userCount = await user.count();

    const ordersByCrypto = await orders.findAll({
      attributes: [
        'assetId',
        [sequelize.fn('COUNT', sequelize.col('assetId')), 'count'],
      ],
      group: ['assetId'],
    });

    const income = await orders.findAll({
      attributes: [
        'ord_type',
        [sequelize.fn('SUM', sequelize.col('fee')), 'total_fee'],
      ],
      group: ['ord_type'],
    });

    // cia reikes realiai atrinkti, kurie naudotojai aktyvus
    const activeUsers = Math.round(userCount / 3);
    const generalData = {
      orderInfo: {
        income: income,
        ordersByCrypto,
      },
      userInfo: {
        userCount: userCount,
        activeUsers: activeUsers,
      },
    };
    return generalData;
  }
}

module.exports = new AdminService();
