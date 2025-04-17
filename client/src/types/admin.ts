export interface IUserGeneral {
  userCount: number;
  activeUsers: number;
  topUsers: { userId: number; first_name: string; totalFee: number; orderCount: number }[];
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
  total: number;
  monthly: {
    [month: string]: number;
  };
}

export interface IAdminOrderInfo {
  income: IAdminIncome[];
  ordersByCrypto: IAdminOrdersByCrypto[];
  monthlyIncome: number;
  monthlyOrdersValue: number;
  yearlyIncomeByMonth: { month: string; limit: number; market: number }[];
  yearlyOrdersValueByMonth: { month: string; limit: number; market: number }[];
  yearlyOrdersValueTotal: number;
 AllOrdersWithUsers: {
  total: number;
  orders: {
    id: number;
    amount: number;
    assetId: string;
    status: string;
    type: string;
    fee: number;
    createdAt: string;
    userName: string;
    closedAt: string;
    price: number;
  }[]
};
}
