export interface IOpenOrder {
  triggerPrice: number;
  id: number;
  assetId: string;
  ord_type: string;
  ord_direct: string;
  price: number;
  amount: number;
  orderValue: number;
  open_date: string;
}

export interface IOrdersHistory {
  triggerPrice: number;
  id: number;
  assetId: string;
  ord_type: string;
  ord_direct: string;
  ord_status: string;
  price: number;
  amount: number;
  orderValue: number;
  open_date: string;
  closed_date: string;
}

export interface IUserAssets {
  asset: string;
  balance: number;
  spotCost: number;
  avgBuyPrice: number;
}

export interface IOrdersHistoryResponse {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  orders: IOrdersHistory[]
}

