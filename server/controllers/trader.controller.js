const ApiError = require('../exceptions/api.errors');
const tradeService = require('../services/trade.service');
const { validationResult } = require('express-validator');

class TraderController {
  async buyCrypto(req, res, next) {
    try {
      const errors = validationResult(req);
      // jei error paverciam ji string
      if (!errors.isEmpty()) {
        const err = errors.array();
        let errString = '';

        for (const element of err) {
          errString += element.msg + '; ';
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
      return res.status(200).json('ok');
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
}

module.exports = new TraderController();
