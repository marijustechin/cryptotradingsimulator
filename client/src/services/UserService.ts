import $api from '../api/axios';
import { IAllUsersInfo, IUserInfo } from '../types/user';

export default class UserService {
  static async getUserInfo(): Promise<IUserInfo> {
    const response = await $api.get('/users/me');
    return response.data;
  }

  /**
   *
   * @param query stringas: page = 1, limit = 10, sort = 'first_name:asc'
   * @returns totalUsers, totalPages, currentPage, users[]
   */
  static async getAllUsers(query: string): Promise<IAllUsersInfo> {
    const response = await $api.get(`/users${query}`);
    return response.data;
  }
}
