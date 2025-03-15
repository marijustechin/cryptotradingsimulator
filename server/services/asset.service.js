const sequelize = require('../config/db');
const { asset } = sequelize.models;

class AssetService {
  async getAssets() {
    const assets = await asset.findAll({ order: [['rank', 'asc']] });
    return assets;
  }

  /**
   *
   * @param {*} assets
   */
  async updateAssets(assets) {
    // atrenkam kainas
    const assetIds = assets.map((item) => item.id);
    const existingAssets = await asset.findAll({
      where: { id: assetIds },
      attributes: ['id', 'priceUsd'],
      raw: true,
    });

    // paverciam masyvu
    const existingAssetMap = new Map(
      existingAssets.map((a) => [a.id, a.priceUsd])
    );

    // atrenkam kur pasikeite kaina
    const assetsToUpdate = assets.filter((item) => {
      const oldPrice = existingAssetMap.get(item.id);
      const newPrice = Math.round(parseFloat(item.priceUsd) * 100) / 100;
      return oldPrice !== newPrice;
    });

    // atnaujinam...
    for (const item of assetsToUpdate) {
      await asset.upsert({
        id: item.id,
        rank: Number(item.rank),
        symbol: item.symbol,
        name: item.name,
        supply: Number(item.supply),
        marketCapUsd: parseFloat(item.marketCapUsd),
        volumeUsd24Hr: Number(item.volumeUsd24Hr),
        priceUsd: parseFloat(item.priceUsd),
        changePercent24Hr:
          Math.round(parseFloat(item.changePercent24Hr) * 1000) / 1000,
        vwap24Hr: parseFloat(item.vwap24Hr),
      });
    }
  }
}

module.exports = new AssetService();
