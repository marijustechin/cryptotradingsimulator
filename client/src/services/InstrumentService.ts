import $api from '../api/axios';
import { IInstrument } from '../types/tradingN';

export default class InstrumentService {
  static async getInstrument(id: string): Promise<IInstrument> {
    const response = await $api.get(`/instrument/${id}`);
    return response.data;
  }
}
