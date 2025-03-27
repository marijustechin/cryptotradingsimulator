const traderController = require("../controllers/trader.controller");
const Router = require("express").Router;
const tradeRouter = new Router();
const authMiddleware = require('../middlewares/auth.middleware')

tradeRouter.post("/",authMiddleware.isAuthenticatedUser, traderController.BuyCrypto);

module.exports = tradeRouter;
