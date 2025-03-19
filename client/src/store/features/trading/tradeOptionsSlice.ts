import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface ITradeOptions {
  orderType: 'limit' | 'market';
  orderDirection: 'buy' | 'sell';
  assetId: string;
  amount: number;
  triggerPrice: number;
  historyInterval:
    | 'm1'
    | 'm5'
    | 'm15'
    | 'm30'
    | 'h1'
    | 'h2'
    | 'h6'
    | 'h12'
    | 'd1';
}

const initialState: ITradeOptions = {
  orderType: 'limit',
  orderDirection: 'buy',
  assetId: '',
  amount: 0.01,
  triggerPrice: 0,
  historyInterval: 'm30',
};

export const tradeOptionsSlice = createSlice({
  name: 'tradeOptions',
  initialState,
  reducers: {
    setOrderType: (state, action: PayloadAction<'limit' | 'market'>) => {
      state.orderType = action.payload;
    },
    setOrderDirection: (state, action: PayloadAction<'buy' | 'sell'>) => {
      state.orderDirection = action.payload;
    },
    setAssetId: (state, action) => {
      state.assetId = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setTriggerPrice: (state, action) => {
      state.triggerPrice = action.payload;
    },
    setHistoryInterval: (state, action) => {
      state.historyInterval = action.payload;
    },
  },
});

export const {
  setOrderType,
  setOrderDirection,
  setAmount,
  setAssetId,
  setTriggerPrice,
  setHistoryInterval,
} = tradeOptionsSlice.actions;

export const selectTradeOptions = (state: RootState) => state.tradeOptions;

export const getHistoryInterval = (state: RootState) =>
  state.tradeOptions.historyInterval;
export const getAssetId = (state: RootState) => state.tradeOptions.assetId;

export default tradeOptionsSlice.reducer;
