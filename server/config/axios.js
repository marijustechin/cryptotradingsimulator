const axios = require('axios');

const API_URL = 'https://api.coincap.io/v2';
const API_KEY = process.env.COINCAP_API_KEY;

const $api = axios.create({
  // kad prie kiekvienos užklausos automatiškai
  // prisikabintų slapukai
  withCredentials: true,
  baseURL: API_URL,
});

// prie kiekvienos uzklausos pridedamas tokenas
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${API_KEY}`;

  return config;
});

module.exports = $api;
