const Router = require('express').Router;
const adminController = require('../controllers/admin.controller');

const adminRouter = new Router();

// gaunam bendrus duomenis
adminRouter.get('/', adminController.getGeneralData);

module.exports = adminRouter;
