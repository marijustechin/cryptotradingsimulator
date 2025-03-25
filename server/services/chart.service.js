const sequelize = require('../config/db');
const { chart } = sequelize.models;

class ChartService {
  async addChartData(data) {
    const chartData = await chart.upsert(data);

    return chartData;
  }

  async getCahrtData(symbol, interval) {
    const chartData = await chart.findAll({
      where: {
        symbol,
        interval,
      },
    });

    return chartData;
  }
}

module.exports = new ChartService();
