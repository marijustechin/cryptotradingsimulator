const Router = require('express').Router;
const chartController = require('../controllers/chart.controller');

const chartRouter = new Router();

// pridedam diagramos duomenis
chartRouter.post('/data', chartController.addChartData);

// gaunam diagramos duomenis
chartRouter.get('/data', chartController.getCahrtData);

module.exports = chartRouter;
