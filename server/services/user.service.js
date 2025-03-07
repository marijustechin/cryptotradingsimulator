const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { user, user_secret, wallet } = sequelize.models;
const ApiError = require('../exceptions/api.errors');
const tokenService = require('../services/token.service');
const { UserInfoDto, AllUsersDto } = require('../dtos/user.dto');
const Op = require('sequelize').Op;

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
      include: [user_secret, wallet],
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
      balance: activeUser.wallet.balance,
    });

    await tokenService.saveRefreshToken(activeUser.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: activeUser.id,
        role: activeUser.role,
        balance: activeUser.wallet.balance,
      },
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

  /**
   *
   * @param {*} page
   * @param {*} limit
   * @param {*} sort
   * @returns totalUsers, totalPages, currentPage, users {}
   */
  async getAllUsers(
    page = 1,
    limit = 10,
    sort = 'first_name:asc',
    filter = ''
  ) {
    const sortOptions = sort.split(':');
    const filterOptions = filter.split(':');
    let whereCondition = '';

    if (filter) {
      whereCondition = {
        [filterOptions[0]]: { [Op.like]: `%${filterOptions[1]}%` },
      };
    }

    console.log(whereCondition);
    // su postgres nebutina,
    // o su mariaDB/mysql sitie parametrai
    // PRIVALO buti skaiciaus tipo, nes mes sintakses klaida
    const { count, rows } = await user.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [sortOptions],
      include: [wallet],
    });

    console.log(count);

    if (rows.length < 1) throw ApiError.NoContent();

    let allUsers = [];

    for (const item of rows) {
      let singleUser = new AllUsersDto(item);
      allUsers.push(singleUser);
    }

    const totalPages =
      count % limit === 0
        ? Math.floor(count / limit)
        : Math.floor(count / limit) + 1;

    return {
      totalUsers: count,
      totalPages: totalPages,
      currentPage: +page,
      users: allUsers,
    };
  }

  async refresh(refreshToken) {
    // patikrinam ar geras
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

    const activeUser = await user.findOne({ where: { id: userData.id } });

    const tokens = tokenService.generateTokens({
      id: activeUser.id,
      role: activeUser.role,
    });

    return { ...tokens, user: { id: activeUser.id, role: activeUser.role } };
  }
}

module.exports = new UserService();
