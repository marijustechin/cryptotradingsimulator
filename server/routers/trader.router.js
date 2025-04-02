const traderController = require("../controllers/trader.controller");
const Router = require("express").Router;
const tradeRouter = new Router();
const authMiddleware = require("../middlewares/auth.middleware");
const validator = require("../validators/order.validator");

tradeRouter.post("/", validator.placeOrder, traderController.buyCrypto);

tradeRouter.get("/openorders/:userId", traderController.getOpenOrders);
tradeRouter.get("/userassets/:userId", traderController.getUserAssets);
tradeRouter.get("/orderhistory/:userId", traderController.getOrdersHistory);

tradeRouter.delete(
  "/:id",
  authMiddleware.isAuthenticatedUser,
  traderController.cancelOrder
);

tradeRouter.patch("/:id", authMiddleware.isAuthenticatedUser, traderController.updateUserOrder)

module.exports = tradeRouter;
