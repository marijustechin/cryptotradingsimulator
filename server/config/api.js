const axios = require('axios');

const $axios = axios.create({
  baseURL: process.env.COINDESK_API_URL,
  // vengiam ilgai trunkanciu uzklausu
  timeout: 5000,
});

$axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.COINDESK_API_KEY}`;
  config.headers['Accept-Encoding'] = 'gzip';
  config.headers['Content-type'] = 'application/json; charset=UTF-8';

  return config;
});

module.exports = $axios;
