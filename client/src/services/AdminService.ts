import $api from '../api/axios';
import { IGeneralInfo } from '../types/admin';

export default class AdminService {
  static async getGeneralInfo(): Promise<IGeneralInfo> {
    const response = await $api.get('/admin');
    return response.data;
  }
}
