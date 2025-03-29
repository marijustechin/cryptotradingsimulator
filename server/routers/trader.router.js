const traderController = require('../controllers/trader.controller');
const Router = require('express').Router;
const tradeRouter = new Router();
const authMiddleware = require('../middlewares/auth.middleware');
const validator = require('../validators/order.validator');

tradeRouter.post('/', validator.placeOrder, traderController.buyCrypto);

tradeRouter.get('/openorders/:userId', traderController.getOpenOrders);

module.exports = tradeRouter;
