const ApiError = require("../exceptions/api.errors");
const tradeService = require("../services/trade.service");
const { validationResult } = require("express-validator");

class TraderController {
  async buyCrypto(req, res, next) {
    try {
      const errors = validationResult(req);
      // jei error paverciam ji string
      if (!errors.isEmpty()) {
        const err = errors.array();
        let errString = "";

        for (const element of err) {
          errString += element.msg + "; ";
        }

        throw new Error(errString);
      }

      const {
        assetId,
        amount,
        ord_direct,
        ord_type,
        price,
        trigerPrice,
        userId,
      } = req.body;

      const newOrder = await tradeService.buyCrypto(
        userId,
        assetId,
        amount,
        ord_direct,
        ord_type,
        price,
        trigerPrice
      );

      return res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }

  async getOpenOrders(req, res, next) {
    try {
      const { userId } = req.params;
      const openOrders = await tradeService.getOpenOrders(userId);
      return res.status(200).json(openOrders);
    } catch (e) {
      next(e);
    }
  }

  async getOrdersHistory(req, res, next) {
    try {
      const { userId } = req.params;
      const userOrders = await tradeService.getUserOrders(userId);
      return res.status(200).json(userOrders);
    } catch (e) {
      next(e);
    }
  }

  async getUserAssets(req, res, next) {
    try {
      const { userId } = req.params;

      const userAssets = await tradeService.getUserAssets(userId);
      return res.status(200).json(userAssets);
    } catch (e) {
      next(e);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deletedOrder = await tradeService.cancelOrder(id, userId);

      return res.status(200).json(deletedOrder);
    } catch (e) {
      next(e);
    }
  }

  async updateUserOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const { triggerPrice, amount } = req.body;

      const editedOrder = await tradeService.editUserOrder(
        id,
        userId,
        triggerPrice,
        amount
      );

      return res.status(200).json(editedOrder);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TraderController();
