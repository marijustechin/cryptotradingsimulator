import $api from '../api/axios';
import { IAllUsersInfo, IUserInfo } from '../types/user';
import { IPortfolioInfo } from '../types/portfolio';

export default class UserService {
  static async getUserInfo(): Promise<IUserInfo> {
    const response = await $api.get('/users/me');
    return response.data;
  }

  /**
   *
   * @param query stringas: page = 1, limit = 10, sort = 'first_name:asc', filter='first_name:string'
   * @returns totalUsers, totalPages, currentPage, users[]
   */
  static async getAllUsers(query: string): Promise<IAllUsersInfo> {
    const response = await $api.get(`/users${query}`);
    return response.data;
  }

  static async deleteUser(id: string): Promise<string> {
    const response = await $api.delete(`/users/${id}`);
    return response.data;
  }

  static async updateUser(
    first_name: string,
    last_name: string,
    email: string,
    address: string,
    phone_number: string
  ): Promise<IUserInfo> {
    const response = await $api.patch('/users/me/update', {
      first_name,
      last_name,
      email,
      address,
      phone_number,
    });
    return response.data;
  }

  static async getUserPortfolio(): Promise<IPortfolioInfo> {
    const response = await $api.get(`/users/transactions`);
    return response.data;
  }
}
