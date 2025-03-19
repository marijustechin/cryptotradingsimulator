import $api from '../api/axios';
import { IAssetHistory, ICryptoAsset, TAssetHistory } from '../types/crypto';

export default class AssetService {
  static async getAssets(): Promise<ICryptoAsset[]> {
    const response = await $api.get(`/crypto/assets`);
    return response.data;
  }

  static async getAssetsHistory(
    asset_id: string,
    limit: number,
    interval?: string
  ): Promise<IAssetHistory[]> {
    const response = await $api.get(
      `/crypto/assets/history/${asset_id}?limit=${limit}&interval=${interval}`
    );

    return response.data;
  }

  static async getAssetHistory(
    asset_id: string,
    interval: string
  ): Promise<TAssetHistory[]> {
    const response = await $api.get(
      `/crypto/assets/assethistory/${asset_id}?interval=${interval}`
    );

    return response.data;
  }
}
