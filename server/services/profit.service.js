const sequelize = require("../config/db");
const { asset, transactions} = sequelize.models;

class ProfitService {
    async countUserProfit(userId, assetId, amount) {
        try {
          
          const getAsset = await asset.findOne({ where: { id: assetId} });
          const currentPrice = parseFloat(getAsset.priceUsd);
      
          const getBuyedPrice = await transactions.findOne({
              where: {
                user_id: userId,
                asset_id: assetId,
                ord_direct: "buy"
              },
              order: [["open_date", "DESC"]]
            });
      
            const parsePrice = parseFloat(getBuyedPrice.price);
            const buyPrice = parsePrice;
    
            const countProfit = (currentPrice + buyPrice) * amount;
            return countProfit;
        } catch (error) {
          console.error("Error proccessing countUserProfit", error.message);
        }
      }
}

module.exports = new ProfitService();