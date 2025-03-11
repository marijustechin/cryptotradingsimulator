const Router = require('express').Router;
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/user.controller');
const validator = require('../validators/user.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const userRouter = new Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuciu
  max: 5, // blokuojam po 5 nesekmingu bandymu
  message: 'Too many login attempts. Please try again later.',
});

// naudotoju registracija
userRouter.post('/registration', validator.register, userController.register);

// naudotoju prisijungimas
// apsauga nuo brute force ataku
// ribojam nesekmingus prisijungimus
userRouter.post('/login', loginLimiter, validator.login, userController.login);

// naudotoju atsijungimas
userRouter.post('/logout', userController.logout);

// konkretaus naudotojo info
userRouter.get('/me', userController.getUserInfo);

// konkretaus naudotojo info atnaujinimas
// isAuthenticatedUser permetam naudotojo duomenis i requesta
userRouter.patch(
  '/me/update',
  authMiddleware.isAuthenticatedUser,
  validator.updateUser,
  userController.updateUser
);

// visu naudotoju info
// gali gauti tik adminas
userRouter.get('/', authMiddleware.isAdmin, userController.getAllUsers);

// naudotojo pasalinimas
// gali tik adminas
userRouter.delete('/:id', authMiddleware.isAdmin, userController.deleteUser);

// refresh accessToken
userRouter.post('/refresh', userController.refresh);

module.exports = userRouter;
