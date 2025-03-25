import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ICandle } from '../../../types/chart';

interface ChartState {
  selectedInterval: '15' | '30' | '60';
  selectedSymbol: string;
  candles: {
    [symbol: string]: {
      [interval: string]: ICandle[];
    };
  };
}

const initialState: ChartState = {
  selectedInterval: '30',
  selectedSymbol: 'BTCUSDT',
  candles: {
    BTCUSDT: {
      '15': [],
      '30': [],
      '60': [],
    },
  },
};

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartInterval: (state, action) => {
      console.log(action.payload);
      state.selectedInterval = action.payload;
    },
    setCandles: (
      state,
      action: PayloadAction<{
        symbol: string;
        interval: string;
        candles: ICandle[];
      }>
    ) => {
      const { symbol, interval, candles } = action.payload;

      // 🔐 Make sure symbol exists
      if (!state.candles[symbol]) {
        state.candles[symbol] = {};
      }

      // 🔐 Make sure interval exists for this symbol
      if (!state.candles[symbol][interval]) {
        state.candles[symbol][interval] = [];
      }

      const existing = state.candles[symbol][interval];

      for (const newCandle of candles) {
        const i = existing.findIndex((c) => c.start === newCandle.start);

        if (i !== -1) {
          // Replace existing candle with same start time
          existing[i] = newCandle;
        } else {
          // Append new candle
          existing.push(newCandle);
        }
      }

      // Optional: Keep only the last N candles
      state.candles[symbol][interval] = existing.slice(-1000);
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
    },
  },
});

export const { setChartInterval, setCandles, setSymbol } = chartSlice.actions;

export const getChartInterval = (state: RootState) =>
  state.chart.selectedInterval;

export const getChartCandles = (state: RootState): ICandle[] => {
  const { selectedSymbol, selectedInterval, candles } = state.chart;

  return candles[selectedSymbol]?.[selectedInterval] || [];
};

export const getChartSymbol = (state: RootState) => state.chart.selectedSymbol;

export default chartSlice.reducer;
