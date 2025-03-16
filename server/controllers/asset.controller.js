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
}

module.exports = new AssetController();
