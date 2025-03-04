import $api from '../api/axios';
import { IAllUsersInfo, IUserInfo } from '../types/user';

export default class UserService {
  static async getUserInfo(): Promise<IUserInfo> {
    const response = await $api.get('/users/me');
    return response.data;
  }

  static async getAllUsers(): Promise<IAllUsersInfo> {
    const response = await $api.get('/users');
    return response.data;
  }
}
