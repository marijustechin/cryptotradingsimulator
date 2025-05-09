import { History } from './models/history';

import dotenv from 'dotenv';
import { ICandle } from './types';
import { OHLCVKlineV5 } from 'bybit-api';

dotenv.config();

export async function insertCandle(candle: ICandle) {
  try {
    await History.upsert({
      symbol: candle.symbol,
      start: Number(candle.start),
      end: Number(candle.end),
      time_interval: candle.time_interval,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    });

    console.log(
      `[DB] Candle upserted: ${candle.symbol} / ${candle.time_interval}`
    );
  } catch (err) {
    console.error('[DB] insertCandle error:', err);
  }
}

export async function getHistory(
  symbol: string,
  time_interval: string
): Promise<ICandle[]> {
  try {
    const result = await History.findAll({
      where: {
        symbol,
        time_interval,
      },
      order: [['start', 'DESC']],
      limit: 300,
    });

    return result.map((r) => r.get({ plain: true })) as ICandle[];
  } catch (err) {
    console.error('[DB] getHistory error:', err);
    return [];
  }
}

export const bybitKlineToDb = async (
  symbol: string,
  time_interval: string,
  candles: OHLCVKlineV5[]
) => {
  let counter = 0;

  try {
    for (const candle of candles) {
      const start = Number(candle[0]);
      const end = start + Number(time_interval) * 60 * 1000 - 1;

      await History.upsert({
        symbol,
        time_interval,
        start,
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        end,
      });

      counter++;
    }

    console.log(
      `[DB] Inserted/updated ${counter} candles for ${symbol}/${time_interval}`
    );
    return counter;
  } catch (err) {
    console.error('[DB] bybitKlineToDb error:', err);
    return counter;
  }
};
