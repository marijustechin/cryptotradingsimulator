const axios = require('axios');

const $api = axios.create({
  baseURL: process.env.COINCAP_API_URL,
  // vengiam ilgai trunkanciu uzklausu
  timeout: 5000,
});

// prie kiekvienos uzklausos pridedamas tokenas
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.COINCAP_API_KEY}`;

  return config;
});

// atsakymu interceptorius:
// pridedam retry mechanizma, jei uzklausa nepavyko
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status >= 500) {
      console.warn('Retrying request...');
      return $api.request(error.config); // Corrected instance name
    }
    return Promise.reject(error);
  }
);

module.exports = $api;
