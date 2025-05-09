import { ICandle } from './types';
interface IFormatResponse {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function formatCandlesForChart(candles: ICandle[]): IFormatResponse[] {
  return candles
    .map((candle) => ({
      time: Number(candle.start) / 1000,
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
    }))
    .sort((a, b) => a.time - b.time); // ascending order
}
