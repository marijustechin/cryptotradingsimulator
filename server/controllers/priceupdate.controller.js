const tradeService = require("../services/trade.service");


class PriceUpdateController {
    async updateprice (req, res, next) {
        const { assetId, marketPrice } = req.body;

        console.log("Price request get:", assetId, marketPrice);

        if (!assetId || !marketPrice) {
          return res.status(400).json({ error: "Missing assetId or price" });
        }
      
        try {
          await tradeService.limitOrder(assetId, marketPrice);
          return res.status(200).json({ message: "Checked limit orders." });
        } catch (err) {
          next(err)
        }
    }
}

module.exports = new PriceUpdateController();