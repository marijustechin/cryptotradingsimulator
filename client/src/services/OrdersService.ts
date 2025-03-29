import { IPortfolioInfo, IUserPortfolioItem } from '../types/portfolio';
import $api from '../api/axios';
import { IOpenOrder, IOrdersHistory, IUserAssets } from '../types/order';

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

  static async getUserAssets(userId: string): Promise<IUserAssets[]> {
    const response = await $api.get(`/trade/userassets/${userId}`);
    return response.data;
  }

  static async getOrdersHistory(userId: string): Promise<IOrdersHistory[]> {
    const response = await $api.get(`/trade/ordershistory/${userId}`);
    return response.data;
  }
}
