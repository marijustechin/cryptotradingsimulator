const Router = require('express').Router;
const assetController = require('../controllers/asset.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const cryptoRouter = new Router();

// kainos, gali gauti tik prisijunges naudotojas
cryptoRouter.get('/assets', assetController.getAssets);

// kainu istorija, gali gauti tik prisijunges naudotojas
cryptoRouter.get('/assets/history/:id', assetController.getAssetsHistory);

// vienos valiutos istorija
cryptoRouter.get('/assets/assethistory/:id', assetController.getAssetHistory);

module.exports = cryptoRouter;
