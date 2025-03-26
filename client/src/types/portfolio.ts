export interface IPortfolioInfo {
    orderID: number,
    ord_direct: string;
    ord_status: string;
    ord_type: string;
    asset_id: string;
    amount: number;
    entry_price: number;
    price_usd: number;
    open_date: string;
    closed_date: string;
    asset: {
        symbol: string;
    }
}

export interface IUserPortfolioItem {
    amount: number;
    asset_id: string;
}