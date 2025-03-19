const Router = require('express').Router;
const assetController = require('../controllers/asset.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const cryptoRouter = new Router();

// kainos, gali gauti tik prisijunges naudotojas
cryptoRouter.get(
  '/assets',
  authMiddleware.isAuthenticatedUser,
  assetController.getAssets
);

// kainu istorija, gali gauti tik prisijunges naudotojas
cryptoRouter.get(
  '/assets/history/:id',
  authMiddleware.isAuthenticatedUser,
  assetController.getAssetsHistory
);

module.exports = cryptoRouter;
