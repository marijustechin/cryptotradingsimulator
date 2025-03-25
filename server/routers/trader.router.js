const traderController = require("../controllers/trader.controller");
const Router = require("express").Router;
const tradeRouter = new Router();

tradeRouter.post("/", traderController.BuyCrypto);

module.exports = tradeRouter;
