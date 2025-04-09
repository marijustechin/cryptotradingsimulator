const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const {
  user,
  asset,
  user_secret,
  wallet,
  transactions,
  portfolio,
  instrument,
} = sequelize.models;
const ApiError = require('../exceptions/api.errors');
const tokenService = require('../services/token.service');
const userLogService = require('../services/userLog.service');
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

      return { message: 'Registration successful. Please login.' };
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
  async login(email, password, ip) {
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
      first_name: activeUser.first_name,
    });

    await tokenService.saveRefreshToken(activeUser.id, tokens.refreshToken);

    // loginam userio data
    await userLogService.logUserLogin(activeUser.id, ip);

    return {
      ...tokens,
      user: {
        id: activeUser.id,
        role: activeUser.role,
        balance: activeUser.wallet.balance,
        first_name: activeUser.first_name,
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

    let whereCondition = '';

    if (filter) {
      const filterOptions = filter.split(':');
      // postgres iesko pagal didziasias ir mazasias raides
      // o mysql/mariadb tas pats
      // todel verciam stulpelius i LOWER tam, kad abejose
      // db nekreiptu demesio i raidziu registra
      whereCondition = {
        [filterOptions[0]]: sequelize.where(
          sequelize.fn('LOWER', sequelize.col(filterOptions[0])), // stulpelis mazisios
          { [Op.like]: `%${filterOptions[1].toLowerCase()}%` } // paieskos tekstas mazosios
        ),
      };
    }

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

  async deleteUser(id) {
    const foundUser = await user.findOne({ where: { id } });

    if (!foundUser) throw ApiError.BadRequest('No such user');

    await foundUser.destroy();

    return 'User deteted';
  }

  async refresh(refreshToken) {
    // patikrinam ar geras
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

    const activeUser = await user.findOne({
      where: { id: userData.id },
      include: [wallet],
    });

    const tokens = tokenService.generateTokens({
      id: activeUser.id,
      role: activeUser.role,
      balance: activeUser.wallet.balance,
    });

    return {
      ...tokens,
      user: {
        id: activeUser.id,
        role: activeUser.role,
        balance: activeUser.wallet.balance,
      },
    };
  }

  async updateUser(userId, updateData) {
    // 1. jei naudotojas atnaujina el. pasta
    //    patikrinam ar toks pastas nenaudojamas
    if (updateData.email) {
      const existingUser = await user.findOne({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw ApiError.ConflictError(
          `Email ${updateData.email} already in use`
        );
      }
    }

    const userToUpdate = await user.findByPk(userId);
    if (!userToUpdate) throw ApiError.NotFound('User not found');

    await userToUpdate.update(updateData);
    return new UserInfoDto(userToUpdate);
  }

  async changePassword(userId, currentPassword, newPassword, repeatPassword) {
    if (!currentPassword || !newPassword || !repeatPassword) {
      throw ApiError.BadRequest('All fields are required');
    }
    if (newPassword !== repeatPassword) {
      throw ApiError.BadRequest('New passwords do not match');
    }

    const userSecret = await user_secret.findOne({
      where: { user_id: userId },
    });

    if (!userSecret) {
      throw ApiError.NotFound('User not found');
    }

    //patikrina dabartini slaptazodi
    const isMatch = await bcrypt.compare(currentPassword, userSecret.password);
    if (!isMatch) throw ApiError.BadRequest('Incorrect current password');

    //patikrina ar naujas slaptazodis skiriasi nuo senojo
    const isSamePassword = await bcrypt.compare(
      newPassword,
      userSecret.password
    );
    if (isSamePassword) {
      throw ApiError.ConflictError(
        'The new password must be different from the old password'
      );
    }

    userSecret.password = newPassword;
    await userSecret.save();

    // istrina sena tokena (force logout)
    await tokenService.removeTokenByUserId(userId);

    return 'Password updated successfully.';
  }

  async getUserPortfolioById(userId, transaction) {
    try {
      const getUserTransaction = await transactions.findAll({
        where: { user_id: userId },
        include: [
          {
            model: instrument,
            as: 'instrument',
            attributes: ['id'],
          },
        ],
        transaction,
      });

      const getUserById = await portfolio.findAll({
        where: { user_id: userId },
        // JOIN instrument
        include: [
          {
            model: instrument,
            as: 'instrument',
            attributes: ['id'], // ka norim pasiimti is instrument lenteles
          },
        ],
        transaction,
      });

      if (!getUserById && getUserTransaction.length === 0) {
        console.log('Transakciju nerasta');
      }

      return {
        transactions: getUserTransaction,
        portfolio: getUserById,
      };
    } catch (error) {
      console.error('There was error with getUserById', error);
      throw new Error();
    }
  }
}

module.exports = new UserService();
