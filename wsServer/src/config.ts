import dotenv from 'dotenv';
dotenv.config();

export const SYMBOLS = [
  'tickers.BTCUSDT',
  'tickers.ETHUSDT',
  'tickers.SOLUSDT',
  'kline.1.BTCUSDT',
  'kline.15.BTCUSDT',
  'kline.30.BTCUSDT',
  'kline.60.BTCUSDT',
  'kline.1.ETHUSDT',
  'kline.15.ETHUSDT',
  'kline.30.ETHUSDT',
  'kline.60.ETHUSDT',
  'kline.1.SOLUSDT',
  'kline.15.SOLUSDT',
  'kline.30.SOLUSDT',
  'kline.60.SOLUSDT',
];

export const wsConfig = {
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_API_SECRET,

  testnet: false,
  category: 'spot', // 👈 This is what made it connect to 'v5SpotPublic'
  pingInterval: 10000,
  reconnectTimeout: 500,
};
