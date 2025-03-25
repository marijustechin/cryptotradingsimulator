export interface IPortfolioInfo {
    orderID: number,
    ord_direct: string;
    ord_status: string;
    ord_type: string;
    asset_id: string;
    amount: number;
    order_value: number;
    open_date: string;
    closed_date: string;
}

export interface IUserPortfolioItem {
    amount: number;
    asset_id: string;
}