const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { user, user_secret, wallet } = sequelize.models;
const ApiError = require('../exceptions/api.errors');
const tokenService = require('../services/token.service');
const { UserInfoDto } = require('../dtos/user.dto');

class UserService {
  /**
   * Naudotojo registracija
   * @param {*} first_name
   * @param {*} email
   * @param {*} password
   * @returns pranesimas
   */
  async register(first_name, email, password) {
    // tikrinam ar el. pasto adresas neuzimtas
    const existingUser = await user.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser)
      throw ApiError.ConflictError(`Email ${email} already in use`);

    // cia naudojam tranzakcijas
    // nes rasom duomenis i dvi lenteles
    const transaction = await sequelize.transaction();

    try {
      await user.create(
        {
          first_name,
          email,
          user_secret: [{ password }], // password hashinamas user_secret modelyje automatiskai
          wallet: [{ balance: 10000 }],
        },
        {
          include: [user_secret, wallet],
          transaction,
        }
      );

      await transaction.commit();

      return { message: 'Registration successfull. Please login.' };
    } catch (e) {
      await transaction.rollback();
      throw ApiError.BadRequest(`Registration failed: ${e.message}`);
    }
  }

  /**
   * Naudotojo prisijungimas
   * @param {*} email
   * @param {*} password
   * @returns tokenus ir naudotojo duomenis {id, role}
   */
  async login(email, password) {
    const activeUser = await user.findOne({
      where: { email },
      include: user_secret,
    });

    if (!activeUser) throw ApiError.BadRequest(`Incorrect email or password`);

    const valid = await bcrypt.compare(
      password,
      activeUser.user_secret.password
    );

    if (!valid) {
      throw ApiError.BadRequest(`Incorrect email or password`);
    }

    const tokens = tokenService.generateTokens({
      id: activeUser.id,
      role: activeUser.role,
    });

    await tokenService.saveRefreshToken(activeUser.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { id: activeUser.id, role: activeUser.role },
    };
  }

  /**
   * Naudotojo isregistravimas
   * @param {*} refreshToken
   * @returns skaicius, kiek irasu istrinta
   */
  async logout(refreshToken) {
    // patikrinam, ar tokenas validus
    const userData = tokenService.validateRefreshToken(refreshToken);

    if (!userData) throw ApiError.BadRequest('Invalid request');

    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async getUserInfo(authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) throw ApiError.UnauthorizedError();

    // Tokenas geras?
    const payload = tokenService.validateAccessToken(accessToken);

    if (!payload) throw ApiError.UnauthorizedError();

    const userInfo = await user.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!userInfo) throw ApiError.UnauthorizedError();

    return new UserInfoDto(userInfo);
  }
}

module.exports = new UserService();
