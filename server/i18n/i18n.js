const i18n = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18n.use(Backend).init({
  lng: 'en',
  fallbackLng: 'lt',
  backend: {
    loadPath: path.join(__dirname, '../i18n/locales/{{lng}}.json'),
  },
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
});

module.exports = i18n;
