import $api from '../api/axios';
import { ICandle } from '../types/candle';
import { ICryptoAsset, IInstrument, TAssetHistory } from '../types/crypto';

export default class AssetService {
  static async getAssets(): Promise<ICryptoAsset[]> {
    const response = await $api.get(`/crypto/assets`);
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

  static async getCandles(
    interval = 'minutes',
    instrument = 'BTC-USD'
  ): Promise<ICandle[]> {
    const query = `/crypto/assets/candles?interval=${interval}&instrument=${instrument}`;
    const response = await $api.get(query);
    return response.data.Data;
  }

  static async getInstruments(): Promise<IInstrument[]> {
    const response = await $api.get('/crypto/instruments');
    return response.data;
  }
}
