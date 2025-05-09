export interface ICandle {
  symbol: string; // BTCUSDT
  start: string; // 1742916600000
  end: string; // 1742916600000
  time_interval: string;
  open: number; // 2074.78
  high: number; // 2067.68
  low: number; //2076.11
  close: number; // 2065.01
  volume: number; // 2401.10145
  timestamp: string; // 1742918400215
}

export interface ITicker {
  symbol: string; //'BTCUSDT',
  lastPrice: number; // '87061.5',
  highPrice24h: number; // '88773.5',
  lowPrice24h: number; // '86305.2',
  prevPrice24h: number; // '87679.3',
  volume24h: number; // '10741.104352',
  turnover24h: number; // '940304307.07105094',
  price24hPcnt: number; // '-0.0070',
  usdIndexPrice: number; // '87086.462514'
}
