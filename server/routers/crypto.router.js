const Router = require('express').Router;
// const { Crypto } = require('../models/crypto.model');

const cryptoRouter = new Router();

// GET /api/v1/crypto - Retrieve stored crypto prices
cryptoRouter.get('/', async (req, res) => {
  try {
    // const cryptoData = await Crypto.findAll({
    //   order: [['marketCap', 'DESC']], // Sorting by market cap (most valuable first)
    // });

    res.json('testas is crypto routerio');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    res.status(500).json({ message: 'Failed to retrieve crypto data' });
  }
});

module.exports = cryptoRouter;
