import { RestClientV5 } from 'bybit-api';
import { bybitKlineToDb } from './db';

const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY_USER,
  secret: process.env.BYBIT_API_SECRET_USER,
  testnet: false,
});

export const getDataFromBybit = async (
  symbol: string,
  interval: '15' | '30' | '60'
) => {
  const response = await client.getKline({
    category: 'spot',
    symbol: symbol,
    interval: interval,
    limit: 400,
  });

  const result = await bybitKlineToDb(symbol, interval, response.result.list);
  console.log('Kline result: ', result);
};
