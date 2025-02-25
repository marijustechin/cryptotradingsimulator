const bcrypt = require("bcryptjs");
const sequelize = require("../db");
const { user, user_secret } = sequelize.models;
const ApiError = require("../exceptions/api.errors");

class UserService {
  /**
   * Naudotojo registracija
   * @param {*} first_name
   * @param {*} email
   * @param {*} password
   * @returns pranesima
   */
  async register(first_name, email, password) {
    // tikrinam ar el. pasto adresas neuzimtas
    const existingUser = await user.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser)
      throw ApiError.BadRequest(`El. pašto adresas ${email} jau naudojamas`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = await sequelize.transaction();
    try {
      // cia naudojam tranzakcijas
      // nes rasom duomenis i dvi lenteles
      await user.create(
        {
          first_name,
          email,
          user_secret: [{ password: hashedPassword }],
        },
        {
          include: [user_secret],
          transaction,
        }
      );
      await transaction.commit();
      return { message: "Registration successfull. Please login." };
    } catch (e) {
      await transaction.rollback();
      throw ApiError.BadRequest("Registration failed.");
    }
  }
}

module.exports = new UserService();
