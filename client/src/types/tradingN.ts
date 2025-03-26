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

export interface ICandle {
  start: number; // 1742904000000,
  end: number; //1742905799999,
  interval: string; // '30',
  open: number; // '87376.5',
  close: number; // '87232.1',
  high: number; // '87442.9',
  low: number; // '87172.6',
  volume: number; // '269.978827',
  turnover: number; // '23563733.47551468',
  confirm: boolean; // true
  timestamp: number; // 1742905801142
}

export interface IInstrument {
  id: string;
  name: string;
  code: string;
  icon: string;
}
