const Router = require('express').Router;
const PriceUpdateController = require('../controllers/priceupdate.controller');

const priceUpdateRouter = new Router();

priceUpdateRouter.post("/", PriceUpdateController.updateprice);

module.exports = priceUpdateRouter;