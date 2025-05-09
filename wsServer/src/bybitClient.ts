// bybitClient.ts
import { WebsocketClient } from 'bybit-api';
import { SYMBOLS, wsConfig } from './config';
import { insertCandle } from './db';
import { ICandle } from './types';
import { broadcastTicker } from './wsServer';

export const connectToBybit = () => {
  const ws = new WebsocketClient(wsConfig);
  ws.subscribeV5(SYMBOLS, 'spot');

  ws.on('update', async (data) => {
    if (data.topic?.startsWith('kline')) {
      const [_, interval, symbol] = data.topic.split('.');
      const candles = data.data;

      for (const candle of candles) {
        if (!candle || candle.confirm === false) continue;

        const formatted = {
          symbol,
          interval,
          open: parseFloat(candle.open),
          high: parseFloat(candle.high),
          low: parseFloat(candle.low),
          close: parseFloat(candle.close),
          volume: parseFloat(candle.volume),
          start: candle.start,
          end: candle.end,
          timestamp: candle.timestamp,
        };

        try {
          if (
            ['1', '15', '30', '60'].includes(interval) &&
            Date.now() >= formatted.end
          ) {
            const toDatabase: ICandle = {
              symbol,
              time_interval: interval,
              open: formatted.open,
              high: formatted.high,
              low: formatted.low,
              close: formatted.close,
              volume: formatted.volume,
              start: candle.start,
              end: candle.end,
              timestamp: candle.timestamp,
            };
            await insertCandle(toDatabase);
          }
        } catch (err) {
          console.error('[DB] Error saving candle:', err);
        }
      }
    }

    if (data.topic?.startsWith('tickers')) {
      broadcastTicker(data.data);
    }
  });

  ws.on('open', ({ wsKey }) => console.log('Bybit WebSocket open:', wsKey));
  ws.on('exception', (err) => console.error('Bybit error:', err));
  ws.on('reconnect', ({ wsKey }) => console.log('Reconnecting:', wsKey));
  ws.on('reconnected', ({ wsKey }) => console.log('Reconnected:', wsKey));
};
