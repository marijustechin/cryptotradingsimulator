const sequelize = require("../config/db");
const { asset, transactions, portfolio, wallet } = sequelize.models;
const ApiError = require("../exceptions/api.errors");

class TradeService {
  async BuyCrypto(userId, assetId, amount) {
    // tikrinam ar asset egzsistuoja
    const existingAsset = await asset.findOne({ where: { id: assetId } });

    // jei neegzistuoja
    if (!existingAsset) {
      throw ApiError.ConflictError("Asset not found");
    }

    // cia darom pirkimo logika

    const transaction = await sequelize.transaction();
    try {
      await transactions.create({
        user_id: userId,
        asset_id: assetId,
        type: "buy",
        amount,
        price: -existingAsset.priceUsd,
      });

      // iterpiam i portfolio naujus duomenys
      await portfolio.create(
        { user_id: userId, asset_id: assetId, amount },
        { transaction }
      );

      await transaction.commit();
      return { message: `Succesfully buyed ${assetId}` };
    } catch (error) {
      throw ApiError.BadRequest(`Buying failed: ${error.message}`);
    }
  }
}

module.exports = new TradeService();
