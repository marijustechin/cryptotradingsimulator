const Router = require("express").Router;
const loginLimiter = require("../middlewares/rate.limit.middleware");
const userController = require("../controllers/user.controller");
const validator = require("../validators/user.validator");
const authMiddleware = require("../middlewares/auth.middleware");

const userRouter = new Router();

// naudotoju registracija
userRouter.post("/registration", validator.register, userController.register);

// naudotoju prisijungimas
// apsauga nuo brute force ataku
// ribojam nesekmingus prisijungimus
userRouter.post("/login", validator.login, loginLimiter, userController.login);

// naudotoju atsijungimas
userRouter.post("/logout", userController.logout);

// konkretaus naudotojo info
userRouter.get("/me", userController.getUserInfo);

userRouter.get('/transactions', authMiddleware.isAuthenticatedUser, userController.getUserPortfolio);

// konkretaus naudotojo info atnaujinimas
// isAuthenticatedUser permetam naudotojo duomenis i requesta
userRouter.patch(
  "/me/update",
  authMiddleware.isAuthenticatedUser,
  validator.updateUser,
  userController.updateUser
);

// visu naudotoju info
// gali gauti tik adminas
userRouter.get("/", authMiddleware.isAdmin, userController.getAllUsers);

// naudotojo pasalinimas
// gali tik adminas
userRouter.delete("/:id", authMiddleware.isAdmin, userController.deleteUser);

// refresh accessToken
userRouter.post("/refresh", userController.refresh);

//slaptazodzio keitimas

userRouter.post(
  "/change-password",
  authMiddleware.isAuthenticatedUser,
  validator.changePassword,
  userController.changePassword
);

// borrows
userRouter.get('/borrows', userController.getAllBorrow);
userRouter.get('/borrows/:userId', userController.getBorrowByUserId);
userRouter.post('/borrow', authMiddleware.isAuthenticatedUser, userController.postBorrow);

module.exports = userRouter;
