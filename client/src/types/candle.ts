export interface ICandle {
  UNIT: string;
  TIMESTAMP: string;
  TYPE: string;
  MARKET: string;
  INSTRUMENT: string;
  MAPPED_INSTRUMENT: string;
  BASE: string;
  QUOTE: string;
  BASE_ID: number;
  QUOTE_ID: number;
  TRANSFORM_FUNCTION: string;
  OPEN: number;
  HIGH: number;
  LOW: number;
  CLOSE: number;
  FIRST_TRADE_TIMESTAMP: number;
  LAST_TRADE_TIMESTAMP: number;
  FIRST_TRADE_PRICE: number;
  HIGH_TRADE_PRICE: number;
  HIGH_TRADE_TIMESTAMP: number;
  LOW_TRADE_PRICE: number;
  LOW_TRADE_TIMESTAMP: number;
  LAST_TRADE_PRICE: number;
  TOTAL_TRADES: number;
  TOTAL_TRADES_BUY: number;
  TOTAL_TRADES_SELL: number;
  TOTAL_TRADES_UNKNOWN: number;
  VOLUME: number;
  QUOTE_VOLUME: number;
  VOLUME_BUY: number;
  QUOTE_VOLUME_BUY: number;
  VOLUME_SELL: number;
  QUOTE_VOLUME_SELL: number;
  VOLUME_UNKNOWN: number;
  QUOTE_VOLUME_UNKNOWN: number;
}

export interface ICandleArray {
  candles: ICandle[];
}

interface ICandleErr {
  type: object;
  properties: object;
}

export interface ICandleAxiosResponse {
  Data: ICandleArray;
  Err: ICandleErr;
}
