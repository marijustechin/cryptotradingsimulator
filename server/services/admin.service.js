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
      attributes: [[sequelize.fn('SUM', sequelize.col('fee')), 'monthly_total']],
      where: { closed_date: { [Op.gte]: date30DaysAgo } },
    });

    const monthlyIncome = parseFloat(monthlyIncomeData?.[0]?.dataValues?.monthly_total || 0);

    const monthlyOrdersValueData = await orders.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'monthly_value']],
      where: { closed_date: { [Op.gte]: date30DaysAgo } },
    });

    const monthlyOrdersValue = parseFloat(monthlyOrdersValueData?.[0]?.dataValues?.monthly_value || 0);

    // Yearly income by month and order type
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const rawYearlyIncome = await orders.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'month'],
        'ord_type',
        [sequelize.fn('SUM', sequelize.col('fee')), 'total_fee'],
      ],
      where: { closed_date: { [Op.gte]: startMonth } },
      group: ['month', 'ord_type'],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'ASC']],
    });

    const incomeByMonthMap = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      incomeByMonthMap[monthKey] = { month: monthKey, limit: 0, market: 0 };
    }

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

    // 🆕 Yearly order value by month and order type
    const rawYearlyOrdersValue = await orders.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'month'],
        'ord_type',
        [sequelize.fn('SUM', sequelize.col('price')), 'total_value'],
      ],
      where: { closed_date: { [Op.gte]: startMonth } },
      group: ['month', 'ord_type'],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'ASC']],
    });

    const ordersValueByMonthMap = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      ordersValueByMonthMap[monthKey] = { month: monthKey, limit: 0, market: 0 };
    }

    rawYearlyOrdersValue.forEach((entry) => {
      const rawMonth = entry.dataValues.month;
      const type = entry.dataValues.ord_type;
      const value = parseFloat(entry.dataValues.total_value || 0);
      const monthKey = new Date(rawMonth).toLocaleString('en-US', { month: 'short' });
      if (ordersValueByMonthMap[monthKey]) {
        ordersValueByMonthMap[monthKey][type] = value;
      }
    });

    const yearlyOrdersValueByMonth = Object.values(ordersValueByMonthMap);
    const yearlyOrdersValueTotal = yearlyOrdersValueByMonth.reduce(
      (acc, month) => acc + month.limit + month.market,
      0
    );

    // Active users in last 30 days
    const activeUsers = await userLogs.count({
      distinct: true,
      col: 'userId',
      where: {
        lastLogin: { [Op.gte]: date30DaysAgo },
      },
    });

    // Top users by fee
    const topUsersRaw = await orders.findAll({
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('fee')), 'totalFeesPaid'],
        [sequelize.fn('COUNT', sequelize.col('orders.id')), 'ordersCount'],
      ],
      group: ['userId', 'user.id'],
      order: [[sequelize.fn('SUM', sequelize.col('fee')), 'DESC']],
      limit: 3,
      include: [{ model: user, attributes: ['email'] }],
    });

    const topUsers = topUsersRaw.map((entry) => ({
      userId: entry.userId,
      email: entry.user.email,
      totalFee: parseFloat(entry.dataValues.totalFeesPaid),
      orderCount: parseInt(entry.dataValues.ordersCount, 10),
    }));

    return {
      orderInfo: {
        income: totalIncomeByType,
        monthlyIncome,
        ordersByCrypto,
        monthlyOrdersValue,
        yearlyIncomeByMonth,
        yearlyOrdersValueByMonth,     // ✅ new
        yearlyOrdersValueTotal        // ✅ new
      },
      userInfo: {
        userCount,
        activeUsers,
        topUsers,
      },
    };
  }
}

module.exports = new AdminService();
