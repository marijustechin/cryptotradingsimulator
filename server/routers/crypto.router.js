const Router = require('express').Router;
const assetController = require('../controllers/asset.controller');

const cryptoRouter = new Router();

// Koks nors komentaras
cryptoRouter.get('/assets', assetController.getAssets);

module.exports = cryptoRouter;
