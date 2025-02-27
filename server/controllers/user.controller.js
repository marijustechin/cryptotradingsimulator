const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const ApiError = require('../exceptions/api.errors');

class UserController {
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

      if (!errors.isEmpty())
        throw ApiError.BadRequest('Validation error', errors.array());

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

      const loggedUser = await userService.login(email, password);

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
}

module.exports = new UserController();
