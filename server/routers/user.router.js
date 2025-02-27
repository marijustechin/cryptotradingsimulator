const Router = require('express').Router;
const userController = require('../controllers/user.controller');
const validator = require('../validators/user.validator');

const userRouter = new Router();

// naudotoju registracija
userRouter.post('/registration', validator.register, userController.register);

// naudotoju prisijungimas
userRouter.post('/login', validator.login, userController.login);

module.exports = userRouter;
