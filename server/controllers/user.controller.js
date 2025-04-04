const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const ApiError = require('../exceptions/api.errors');
const helperService = require('../services/helper.service');

class UserController {
  errorToString(errorsArray) {
    let errString = '';

    for (const element of errorsArray) {
      errString += element.msg + '; ';
    }

    return errString;
  }
  /**
   * Naudotojo registracija
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns pranesimas apie sekminga registracija
   */
  async register(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // galimas ir toks variantas
        // grazinam ne masyva, o perdarom ir string pranesimus
        const err = errors.array();
        let errString = '';

        for (const element of err) {
          errString += element.msg + '; ';
        }

        throw ApiError.BadRequest(errString);
      }

      const { first_name, email, password } = req.body;

      const newUser = await userService.register(first_name, email, password);

      return res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Naudotojo prisijungimas
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns tokena ir naudotoja (id, role) arba pranesima apie klaida
   */
  async login(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        throw ApiError.BadRequest('Validation error', errors.array());

      // jei nera validacijos klaidu, tesiam
      const { email, password } = req.body;

      const loggedUser = await userService.login(email, password, req.ip);

      // refreshToken dedam i cookies
      res.cookie('refreshToken', loggedUser.refreshToken, {
        maxAge: 24 * 60 * 60 * 1000, // 1 diena
        httpOnly: true,
      });

      return res
        .status(200)
        .json({ accessToken: loggedUser.accessToken, user: loggedUser.user });
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns success: status 200 + message failure: status 204 no content
   */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      // jei nėra refresh tokeno, tai saugumo sumetimais
      // grąžiname 204 status, tipo kad nenutekėtų info
      if (!refreshToken) throw ApiError.NoContent();

      await userService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.status(200).json({ message: 'Logout successfull.' });
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns user info objektas (id, first_name, last_name, address, phone_number)
   */
  async getUserInfo(req, res, next) {
    try {
      // patikrinam, ar yra access tokenas
      const authorizationHeader = req.headers.authorization;

      // jei nera, klaida 401
      if (!authorizationHeader) throw ApiError.UnauthorizedError();

      const userInfo = await userService.getUserInfo(authorizationHeader);

      return res.status(200).json(userInfo);
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns status(200) totals + users
   */
  async getAllUsers(req, res, next) {
    try {
      const { page, limit, sort, filter } = req.query;

      const allUsers = await userService.getAllUsers(page, limit, sort, filter);

      return res.status(200).json(allUsers);
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res.clearCookie('refreshToken'); // sena tikrai ismetam
        throw ApiError.UnauthorizedError();
      }

      const userData = await userService.refresh(refreshToken);

      if (!userData) {
        res.clearCookie('refreshToken'); // Ismetam netinkama tokena
        throw ApiError.UnauthorizedError();
      }

      //
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 24 * 60 * 60 * 1000, // 1 diena
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Produksine apsaugom
        sameSite: 'Strict',
      });

      return res
        .status(200)
        .json({ accessToken: userData.accessToken, user: userData.user });
    } catch (e) {
      res.clearCookie('refreshToken'); // Visada istrinam nereikalinga tokena
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      // 1. ziurim, ar nera validacijos klaidu ***************************
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = helperService.errorsToString(errors.array());
        throw ApiError.BadRequest(errorMessage);
      }

      // 2. jei viskas ok, userId ateina is authmiddleware->isAuthenticatedUser
      const userId = req.user.id;

      // 3. visus duomenis perduodam i update servisa
      const { first_name, last_name, email, address, phone_number } = req.body;

      const updatedUser = await userService.updateUser(userId, {
        first_name,
        last_name,
        email,
        address,
        phone_number,
      });

      return res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      await userService.deleteUser(userId);
      return res.status(200).json(userId);
    } catch (e) {
      next(e);
    }
  }

  async changePassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = helperService.errorsToString(errors.array());
        throw ApiError.BadRequest(errorMessage);
      }

      const userId = parseInt(req.user.id, 10); //prisijungusio vartotojo id
      const { currentPassword, newPassword, repeatPassword } = req.body;

      const response = await userService.changePassword(
        userId,
        currentPassword,
        newPassword,
        repeatPassword
      );
      res.clearCookie('refreshToken');

      return res.status(200).json({ message: response });
    } catch (e) {
      next(e);
    }
  }

  async getUserPortfolio(req, res, next) {
    try {
      const userId = req.user.id;
      if (!userId) {
        const errorMessage = helperService.errorsToString(errors.array());
        throw ApiError.BadRequest(errorMessage);
      }

      const getUserPortfolio = await userService.getUserPortfolioById(userId);

      if (!getUserPortfolio) {
        const errorMessage = helperService.errorsToString(errors.array());
        throw ApiError.BadRequest(errorMessage);
      }

      return res.status(200).json(getUserPortfolio);
    } catch (error) {
      next(error); // siunciam i middlewear;
    }
  }
}

module.exports = new UserController();
