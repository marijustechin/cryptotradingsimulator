import $api from '../api/axios';
import { IAssetHistory, ICryptoAsset } from '../types/crypto';

export default class AssetService {
  static async getAssets(): Promise<ICryptoAsset[]> {
    const response = await $api.get(`/crypto/assets`);
    return response.data;
  }

  static async getAssetsHistory(
    asset_id: string,
    limit: number
  ): Promise<IAssetHistory[]> {
    const response = await $api.get(
      `/crypto/assets/history/${asset_id}?limit=${limit}`
    );

    return response.data;
  }
}
