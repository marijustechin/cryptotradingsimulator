import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface ITradeOptions {
  orderType: 'limit' | 'market';
  orderDirection: 'buy' | 'sell';
  currency: string;
  amount: number;
  triggerPrice: number;
}

const initialState: ITradeOptions = {
  orderType: 'limit',
  orderDirection: 'buy',
  currency: '',
  amount: 0.01,
  triggerPrice: 0,
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
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setTriggerPrice: (state, action) => {
      state.triggerPrice = action.payload;
    },
  },
});

export const {
  setOrderType,
  setOrderDirection,
  setAmount,
  setCurrency,
  setTriggerPrice,
} = tradeOptionsSlice.actions;

export const selectTradeOptions = (state: RootState) => state.tradeOptions;

export default tradeOptionsSlice.reducer;
