import $api from '../api/axios';
import { ICryptoAsset } from '../types/crypto';

export default class AssetService {
  static async getAssets(): Promise<ICryptoAsset[]> {
    const response = await $api.get(`/crypto/assets`);
    return response.data;
  }
}
