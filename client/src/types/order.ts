export interface IOpenOrder {
  triggerPrice: number;
  id: number;
  assetName: string;
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
  fee: number;
}

export interface IUserAssets {
  asset: string;
  available: number;
  reserved: number;
  balance: number;
  spotCost: number;
  amount: number;
  avgBuyPrice: number;
}

export interface IOrdersHistoryResponse {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  orders: IOrdersHistory[];
}
