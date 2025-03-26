const Router = require('express').Router;
const instrumentController = require('../controllers/instrument.controller');

const instrumentRouter = new Router();

// gaunam viena instrumenta (valiuta)
instrumentRouter.get('/:id', instrumentController.getInstrument);

module.exports = instrumentRouter;
