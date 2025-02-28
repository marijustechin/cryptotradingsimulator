const jwt = require('jsonwebtoken');
const sequelize = require('../config/db');
const { token } = sequelize.models;

class TokenService {
  // payload - tai duomenys, kuriuos tures uzsifruotus jwt
  // cia turetu buti role ir naudotojo ID
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(user_id, refreshToken) {
    // naudotojas gali turėti tik vieną aktyvų refresh tokeną
    // jei jis buvo prisijungęs iš kito įrenginio,
    // po prisijungimo jo tokenas bus perrašytas ir jis bus atjungtas
    // tame irenginyje

    // ziurim, ar juzeris turi tokena?
    const tokenData = await token.findOne({ where: { user_id } });

    // jei turi, tai sena pakeiciam nauju
    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return await tokenData.save();
    }

    // sunaikinam sena tokena
    await token.destroy({ where: { user_id } });

    return await token.create({
      refreshToken,
      user_id,
    });
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      return userData;
    } catch (e) {
      return null;
    }
  }

  async removeToken(refreshToken) {
    const tokenData = await token.destroy({ where: { refreshToken } });

    return tokenData;
  }

  async findToken(refreshToken) {
    const res = await token.findOne({ where: { refreshToken: refreshToken } });

    return res;
  }
}

module.exports = new TokenService();
