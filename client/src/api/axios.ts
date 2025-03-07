import axios from 'axios';
import AuthService from '../services/AuthService';

export const API_URL = 'http://localhost:3003/api/v1';

const $api = axios.create({
  // kad prie kiekvienos užklausos automatiškai
  // prisikabintų slapukai
  withCredentials: true,
  baseURL: API_URL,
});

// prie kiekvienos uzklausos pridedamas tokenas
$api.interceptors.request.use((config) => {
  // localStorage saugomas accesToken jei juzeris prisijunges
  // pirma gaunam tokena is local storage, jei toks yra
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// atsakymai
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response.status === 403) {
      try {
        const newToken = await AuthService.refresh();
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return $api(error.config); // bandom dar karta
        }
      } catch (refreshError) {
        console.error('No refresh token, logging out...', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // ar geriau naudojam navigate ???
      }
    }
    return Promise.reject(error);
  }
);

export default $api;
