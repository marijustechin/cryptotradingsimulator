import { IPortfolioInfo, IUserPortfolioItem } from '../types/portfolio';
import $api from '../api/axios';
import { IOpenOrder } from '../types/order';

export default class OrdersService {
  static async getUserOrders(): Promise<{
    transactions: IPortfolioInfo[];
    portfolio: IUserPortfolioItem[];
  }> {
    const response = await $api.get(`/users/transactions`);
    return response.data;
  }

  static async placeOrder(
    assetId: string,
    amount: number,
    ord_direct: string,
    ord_type: string,
    price: number,
    userId: string,
    trigerPrice = 0
  ): Promise<string> {
    const response = await $api.post('/trade', {
      assetId,
      amount,
      ord_type,
      ord_direct,
      price,
      trigerPrice,
      userId,
    });
    return response.data.message;
  }

  static async getOpenOrders(userId: string): Promise<IOpenOrder[]> {
    const response = await $api.get(`/trade/openorders/${userId}`);
    return response.data;
  }
}
