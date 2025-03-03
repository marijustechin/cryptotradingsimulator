import $api from '../api/axios';
import { IUserInfo } from '../types/user';

export default class UserService {
  static async getUserInfo(): Promise<IUserInfo> {
    const response = await $api.get('/users/me');
    return response.data;
  }
}
