const ApiError = require('../exceptions/api.errors');
const tokenService = require('../services/token.service');

class AuthMiddleware {
  // Bendras auteentifikavimas visiem naudotojam
  async isAuthenticatedUser(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) throw new ApiError.UnauthorizedError();

      const accessToken = authorizationHeader.split(' ')[1];


      if (!accessToken) throw new ApiError.UnauthorizedError();

      // Tokenas ok?
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) throw new ApiError.UnauthorizedError();

      req.user = userData; // naudotojo duomenis dedam i requesta
      next();
    } catch (e) {
      return next(ApiError.UnauthorizedError());
    }
  }

  // Ar adminas?
  async isAdmin(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) throw new ApiError.UnauthorizedError();

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) throw new ApiError.UnauthorizedError();

      // Tokenas geras?
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) throw new ApiError.UnauthorizedError();

      // Admin role?
      if (userData.role !== 'ADMIN') throw new ApiError.Forbidden();

      req.user = userData; // irasom user duomenis i requesta
      next();
    } catch (e) {
      return next(ApiError.Forbidden(e));
    }
  }
}

module.exports = new AuthMiddleware();
