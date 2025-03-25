const chartService = require('../services/chart.service');

class ChartController {
  async addChartData(req, res, next) {
    try {
      const data = await chartService.addChartData(req.body);

      return res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  async getCahrtData(req, res, next) {
    try {
      const { symbol, interval } = req.query;

      const data = await chartService.getCahrtData(symbol, interval);

      return res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ChartController();
