const ApiError = require("../exceptions/api.errors");
const TradeService = require("../services/trade.service");
const { validationResult } = require("express-validator");

class TraderController {
  async BuyCrypto(req, res, next) {
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
        userId,
        assetId,
        amount,
        ord_direct,
        ord_type,
        price,
      } = req.body;


      const getTransaction = await TradeService.BuyCrypto(
        userId,
        assetId,
        amount,
        ord_direct,
        ord_type,
        price
      );

      

      return res.status(201).json(getTransaction);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TraderController();
