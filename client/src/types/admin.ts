export interface IUserGeneral {
  userCount: number;
  activeUsers: number;
}
export interface IGeneralInfo {
  userInfo: IUserGeneral;
  orderInfo: IAdminOrderInfo;
}

export interface IAdminIncome {
  ord_type: string;
  total_fee: number;
}

export interface IAdminOrdersByCrypto {
  assetId: string;
  count: number;
}

export interface IAdminOrderInfo {
  income: IAdminIncome[];
  ordersByCrypto: IAdminOrdersByCrypto[];
  monthlyIncome: number;
  monthlyOrdersValue: number;
  yearlyIncomeByMonth: { month: string; limit: number; market: number }[];
}
