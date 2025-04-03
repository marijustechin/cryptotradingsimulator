const sequelize = require('../config/db');
const { userLogs } = sequelize.models;

class UserLogService {
  async logUserLogin(userId, ip) {
    await userLogs.create({
      userId,
      ip,
      lastLogin: new Date(),
    });
  }
}

module.exports = new UserLogService();
