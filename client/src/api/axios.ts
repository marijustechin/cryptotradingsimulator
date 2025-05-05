import axios from 'axios';
import AuthService from '../services/AuthService';
const lang = localStorage.getItem('selectedLanguage') || 'lt';

export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3003/api/v1';

const $api = axios.create({
  // kad prie kiekvienos užklausos automatiškai
  // prisikabintų slapukai
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    'Accept-Language': lang,
  },
});

// prie kiekvienos uzklausos pridedamas tokenas
$api.interceptors.request.use((config) => {
  // localStorage saugomas accesToken jei juzeris prisijunges
  // pirma gaunam tokena is local storage, jei toks yra
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const lang = localStorage.getItem('selectedLanguage');
  config.headers['Accept-Language'] = lang;

  return config;
});

// atsakymai
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop
    if (
      (error.response?.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await AuthService.refresh();
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return $api(originalRequest);
        }
      } catch (refreshError) {
        console.error('No refresh token, logging out...', refreshError);
        await $api.post<{ message: string }>(`/users/logout`);
        window.location.href = '/login';
      }
    }

    return Promise.reject(
      error instanceof Error
        ? error
        : new Error(error.message ?? 'Unknown error')
    );
  }
);

export default $api;
