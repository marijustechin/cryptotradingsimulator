const i18n = require('../i18n/i18n');

const languageMiddleware = (req, res, next) => {
  const lang = req.headers['accept-language']?.startsWith('lt') ? 'lt' : 'en';
  i18n.changeLanguage(lang);
  next();
};

module.exports = languageMiddleware;
