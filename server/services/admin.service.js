const sequelize = require('../config/db');
const { user, userLogs } = sequelize.models;

class AdminService {
  async getGeneralData() {
    // count all users
    const userCount = await user.count();

    // cia reikes realiai atrinkti, kurie naudotojai aktyvus
    const activeUsers = Math.round(userCount / 3);
    const generalData = {
      userInfo: { userCount: userCount, activeUsers: activeUsers },
    };
    return generalData;
  }
}

module.exports = new AdminService();
