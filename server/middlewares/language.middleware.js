const i18n = require('../i18n/i18n');

const languageMiddleware = (req, res, next) => {
  const langHeader = req.headers['accept-language'];
  const lang = langHeader?.startsWith('lt') ? 'lt' : 'en';
  i18n.changeLanguage(lang);
  next();
};

module.exports = languageMiddleware;
