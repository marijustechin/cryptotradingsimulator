import { IPortfolioInfo, IUserPortfolioItem } from "../types/portfolio";
import $api from "../api/axios";

export default class OrdersService {
  static async getUserOrders(): Promise<{
    transactions: IPortfolioInfo[];
    portfolio: IUserPortfolioItem[];
  }> {
    const response = await $api.get(`/users/transactions`);
    return response.data;
  }
}
