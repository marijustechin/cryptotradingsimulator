const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const ApiError = require("../exceptions/api.errors");

class UserController {
  /**
   * Naudotojo registracija
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns tokenus ir naudotojo duomenis
   */
  async register(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        throw ApiError.BadRequest("Validation error", errors.array());

      const { first_name, email, password } = req.body;

      const newUser = await userService.register(first_name, email, password);

      return res.status(200).json(newUser);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
