import $api from '../api/axios';
import { ICandle } from '../types/chart';

export default class ChartService {
  static async getChartData(
    symbol: string,
    interval: string
  ): Promise<ICandle[]> {
    const response = await $api.get(
      `/chart/data?symbol=${symbol}&interval=${interval}`
    );

    return response.data;
  }

  static async addChartData(data: ICandle): Promise<string> {
    const response = await $api.post('/chart/data', data);

    return response.data;
  }
}
