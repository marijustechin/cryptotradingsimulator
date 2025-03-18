const sequelize = require("../config/db");
const { asset, transactions, portfolio } = sequelize.models;
const ApiError = require("../exceptions/api.errors");

class TradeService {
  async BuyCrypto(userId, assetId, amount) {
    // tikrinam ar asset egzsistuoja
    const getAsset = await asset.findOne({ where: { id: assetId } });

    // jei neegzistuoja
    if (!getAsset) {
      throw ApiError.ConflictError("Asset not found");
    }

    // cia darom pirkimo logika
    // transakcija

    const transaction = await sequelize.transaction();

    try {
      // jei vartotojas jau turi valiuta ta pačia valiuta
      // atnaujiname jos verte
      let userAsset = await transactions.findOne({
        where: { user_id: userId, asset_id: assetId.toString() },
      });

      if (userAsset) {
        await transactions.update(
          { amount: userAsset.amount + amount },
          { where: { id: userAsset.id }, transaction }
        );
        console.log("get user data", userAsset);
      } else {
        // jei neegzistuoja sukuriam nauja
        userAsset = await transactions.create(
          {
            user_id: userId,
            asset_id: assetId,
            type: "buy",
            amount,
            openprice: getAsset.priceUsd,
          },
          { transaction }
        );
      }

      const userPortfolio = await portfolio.findOne({ where: { id: userId } });

      if (!userPortfolio) {
        userPortfolio = await portfolio.create(
          {
            transaction_id: transaction.id,
          },
          { transaction }
        );
      }

      await transaction.commit();

      return { message: `Succesfully buyed ${assetId}` };
    } catch (error) {
      throw ApiError.BadRequest(`Buying failed: ${error.message}`);
    }
  }
}

module.exports = new TradeService();
