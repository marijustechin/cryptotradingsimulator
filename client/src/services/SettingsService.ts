import $api from '../api/axios';
import { ISettings } from '../types/settings';

export default class SettingsService {
  static async getSettings(): Promise<ISettings> {
    const response = await $api.get('/settings');

    return response.data;
  }

  static async generateFakeUsers(
    usersCount = 100,
    defaultPassword = 'password1'
  ): Promise<string> {
    const response = await $api.post('/settings/generateusers', {
      usersCount: usersCount,
      defaultPassword: defaultPassword,
    });

    return response.data;
  }

  static async generateFakeActivity(): Promise<string> {
    const response = await $api.post('/settings/generateactivity');

    return response.data;
  }

  static async updateSystemFee(
    limitFee?: number,
    marketFee?: number
  ): Promise<string> {
    const response = await $api.patch('/settings/updatefee', {
      limitFee,
      marketFee,
    });

    return response.data;
  }
}
