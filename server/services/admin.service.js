const sequelize = require('../config/db');
const { user, userLogs, orders } = sequelize.models;
const { Op } = require('sequelize');

class AdminService {
  async getGeneralData() {
    const userCount = await user.count();

    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    // 🟪 Orders grouped by asset (last 12 months)
    const rawOrdersByCryptoMonthly = await orders.findAll({
      attributes: [
        'assetId',
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        closed_date: { [Op.gte]: startMonth },
      },
      group: ['assetId', sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date'))],
      order: [
        ['assetId', 'ASC'],
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('closed_date')), 'ASC'],
      ],
    });

    const ordersByCryptoMonthlyMap = {};
    rawOrdersByCryptoMonthly.forEach(entry => {
      const assetId = entry.assetId;
      const rawMonth = entry.dataValues.month;
      const count = parseInt(entry.dataValues.count, 10);
      const month = new Date(rawMonth).toLocaleString('en-US', { month: 'short' });

      if (!ordersByCryptoMonthlyMap[assetId]) {
        ordersByCryptoMonthlyMap[assetId] = { assetId, total: 0, monthly: {} };
      }

      ordersByCryptoMonthlyMap[assetId].monthly[month] = count;
      ordersByCryptoMonthlyMap[assetId].total += count;
    });

    const ordersByCrypto = Object.values(ordersByCryptoMonthlyMap);

    // 🟩 Total income by order type (last 12 months)
    const totalIncomeByType = await orders.findAll({
      attributes: [
        'ord_type',
        [sequelize.fn('SUM', sequelize.col('fee')), 'total_fee'],
      ],
      where: {
        closed_date: { [Op.gte]: startMonth },
      },
      group: ['ord_type'],
    });

    // 🟨 Monthly income & turnover (last 30 days)
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

    // 🟦 Yearly income by month/type (last 12 months)
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

    // 🟥 Yearly order value by type (last 12 months)
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

    // 👤 Active users (last 30 days)
    const activeUsers = await userLogs.count({
      distinct: true,
      col: 'userId',
      where: {
        lastLogin: { [Op.gte]: date30DaysAgo },
      },
    });

    // 🏆 Top users by fee (last 30 days)
    const topUsersRaw = await orders.findAll({
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('fee')), 'totalFeesPaid'],
        [sequelize.fn('COUNT', sequelize.col('orders.id')), 'ordersCount'],
      ],
      where: {
        closed_date: { [Op.gte]: date30DaysAgo }, // ✅ Only last 30 days
      },
      group: ['userId', 'user.id'],
      order: [[sequelize.fn('SUM', sequelize.col('fee')), 'DESC']],
      limit: 3,
      include: [{ model: user, attributes: ['first_name'] }],
    });

    const topUsers = topUsersRaw.map((entry) => ({
      userId: entry.userId,
      first_name: entry.user.first_name,
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
        yearlyOrdersValueByMonth,
        yearlyOrdersValueTotal,
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
