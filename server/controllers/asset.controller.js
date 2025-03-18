const assetService = require('../services/asset.service');

class AssetController {
  async getAssets(req, res, next) {
    try {
      const assets = await assetService.getAssets();

      return res.status(200).json(assets);
    } catch (e) {
      next(e);
    }
  }

  async getAssetsHistory(req, res, next) {
    try {
      const asset_id = req.params.id;
      const { limit } = req.query;
      const assetsHistory = await assetService.getAssetsHistory(
        asset_id,
        limit
      );

      return res.status(200).json(assetsHistory);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AssetController();
