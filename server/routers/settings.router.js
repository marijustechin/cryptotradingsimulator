const Router = require('express').Router;
const settingsController = require('../controllers/settings.controller');

const settingsRouter = new Router();

settingsRouter.get('/', settingsController.getSettings);
settingsRouter.post('/generateusers', settingsController.generateFakeUsers);
settingsRouter.post(
  '/generateactivity',
  settingsController.generateFakeActivity
);
settingsRouter.patch('/updatefee', settingsController.updateFees);

module.exports = settingsRouter;
