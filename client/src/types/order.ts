export interface IOpenOrder {
  triggerPrice: 1840;
  id: number;
  assetName: string;
  ord_type: string;
  ord_direct: string;
  price: number;
  amount: number;
  orderValue: number;
  open_date: string;
}

export interface IOrdersHistory {
  triggerPrice: 1840;
  id: number;
  assetName: string;
  ord_type: string;
  ord_direct: string;
  price: number;
  amount: number;
  orderValue: number;
  open_date: string;
}

export interface IUserAssets {
  asset: string;
  balance: number;
  spotCost: number;
  avgBuyPrice: number;
}

//export interface IUserAssets {}
