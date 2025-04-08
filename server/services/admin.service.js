const sequelize = require('../config/db');
const { user, userLogs, orders } = sequelize.models;
const { Op } = require('sequelize');

class AdminService {
  async getGeneralData() {
    // Total users
    const userCount = await user.count();

    // Orders grouped by asset
    const ordersByCrypto = await orders.findAll({
      attributes: [
        'assetId',
        [sequelize.fn('COUNT', sequelize.col('assetId')), 'count'],
      ],
      group: ['assetId'],
    });

    // Total income grouped by order type
    const totalIncomeByType = await orders.findAll({
      attributes: [
        'ord_type',
        [sequelize.fn('SUM', sequelize.col('fee')), 'total_fee'],
      ],
      group: ['ord_type'],
    });

    // Monthly income & order value (last 30 days)
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const monthlyIncomeData = await orders.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('fee')), 'monthly_total'],
      ],
      where: {
        closed_date: {
          [Op.gte]: date30DaysAgo,
        },
      },
    });

    const monthlyIncome = parseFloat(monthlyIncomeData?.[0]?.dataValues?.monthly_total || 0);

    const monthlyOrdersValueData = await orders.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('price')), 'monthly_value'],
      ],
      where: {
        closed_date: {
          [Op.gte]: date30DaysAgo,
        },
      },
    });

    const monthlyOrdersValue = parseFloat(monthlyOrdersValueData?.[0]?.dataValues?.monthly_value || 0);

    // Yearly income by month and order type (last 12 months)
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const rawYearlyIncome = await orders.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'month'],
        'ord_type',
        [sequelize.fn('SUM', sequelize.col('fee')), 'total_fee'],
      ],
      where: {
        closed_date: {
          [Op.gte]: startMonth,
        },
      },
      group: ['month', 'ord_type'],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'ASC']],
    });

    // Fill in 12 months with default values
    const incomeByMonthMap = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      incomeByMonthMap[monthKey] = { month: monthKey, limit: 0, market: 0 };
    }

    // Populate values from DB
    rawYearlyIncome.forEach((entry) => {
      const rawMonth = entry.dataValues.month;
      const type = entry.dataValues.ord_type;
      const fee = parseFloat(entry.dataValues.total_fee || 0);

      const monthKey = new Date(rawMonth).toLocaleString('en-US', { month: 'short' });
      if (incomeByMonthMap[monthKey]) {
        incomeByMonthMap[monthKey][type] = fee;
      }
    });

    const yearlyIncomeByMonth = Object.values(incomeByMonthMap);

    // Active users in the last 30 days
    const activeUsers = await userLogs.count({
      distinct: true,
      col: 'userId',
      where: {
        lastLogin: {
          [Op.gte]: date30DaysAgo,
        },
      },
    });
// Add this before the final return in getGeneralData()
const topUsersRaw = await orders.findAll({
  attributes: [
    'userId',
    [sequelize.fn('SUM', sequelize.col('fee')), 'totalFeesPaid'],
    [sequelize.fn('COUNT', sequelize.col('orders.id')), 'ordersCount'], // ✅ disambiguate "id"
  ],
  group: ['userId', 'user.id'], // ✅ include 'user.id' because of join
  order: [[sequelize.fn('SUM', sequelize.col('fee')), 'DESC']],
  limit: 3,
  include: [
    {
      model: user,
      attributes: ['email'],
    },
  ],
});
const topUsers = topUsersRaw.map((entry) => ({
  userId: entry.userId,
  email: entry.user.email,
  totalFee: parseFloat(entry.dataValues.totalFeesPaid), // renamed to match your component prop
  orderCount: parseInt(entry.dataValues.ordersCount, 10),
}));


// Then modify the return
return {
  orderInfo: {
    income: totalIncomeByType,
    monthlyIncome,
    ordersByCrypto,
    monthlyOrdersValue,
    yearlyIncomeByMonth,
  },
  userInfo: {
    userCount,
    activeUsers,
    topUsers
  },
};

  }
}

module.exports = new AdminService();
