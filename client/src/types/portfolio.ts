export interface IPortfolioInfo {
    ord_direct: string;
    ord_status: string;
    ord_type: string;
    asset_id: string;
    amount: number;
    order_value: number;
}

export interface IUserPortfolioItem {
    amount: number;
    asset_id: string;
}