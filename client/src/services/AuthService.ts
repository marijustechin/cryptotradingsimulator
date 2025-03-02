import $api, { API_URL } from '../api/axios';

const USER_URL = API_URL + '/users';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; role: string };
}

interface AuthResponse {
  message: string;
}

export default class AuthService {
  /**
   * Naudotojo registracija
   * @param first_name
   * @param email
   * @param password
   * @returns teksto eilute
   */
  static async register(
    first_name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await $api.post<AuthResponse>(`${USER_URL}/registration`, {
      first_name,
      email,
      password,
    });
    return response.data;
  }

  /**
   * Naudotojo prisijungimas
   * @param email
   * @param password
   * @returns tokenai ir naudotojo id ir role
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await $api.post<LoginResponse>(`${USER_URL}/login`, {
      email,
      password,
    });
    return response.data;
  }

  static async logout(): Promise<AuthResponse> {
    const response = await $api.post<AuthResponse>(`${USER_URL}/logout`);
    return response.data;
  }

  /**
   * Refreshinam access tokena
   * @returns accessToken kaip stringa
   */
  static async refresh(): Promise<string> {
    const response = await $api.post(`${USER_URL}/refresh`);
    return response.data.accessToken;
  }
}
