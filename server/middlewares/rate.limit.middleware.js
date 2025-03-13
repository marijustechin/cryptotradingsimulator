const rateLimit = require('express-rate-limit');
const ApiError = require('../exceptions/api.errors');

const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minuciu laikotarpis
  max: 5, // blokuojam po 5 nesekmingu bandymu
  handler: (req, res, next) => {
    next(
      ApiError.BadRequest('Too many login attempts, please try again later')
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
