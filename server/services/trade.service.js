const sequelize = require("../config/db");
const { asset, transactions } = sequelize.models;
const ApiError = require("../exceptions/api.errors");

class TradeService {
  async BuyCrypto(userId, assetId, amount) {
    // tikrinam ar asset egzsistuoja
    const existingAsset = await asset.findOne({ where: { id: assetId } });

    // jei neegzistuoja
    if (!existingAsset) {
      throw ApiError.ConflictError("Asset not found");
    }

    console.log(existingAsset.priceUsd);

    // cia darom pirkimo logika
    try {
      await transactions.create({
        user_id: userId,
        asset_id: assetId,
        type: "buy",
        amount,
        openprice: existingAsset.priceUsd,
      });
      return { message: `Succesfully buyed ${assetId}` };
    } catch (error) {
      throw ApiError.BadRequest(`Buying failed: ${error.message}`);
    }
  }
}

module.exports = new TradeService();
