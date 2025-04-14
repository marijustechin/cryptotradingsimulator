import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IInstrument } from '../../../types/tradingN';

interface ITradingOptions {
  allActiveSymbols: IInstrument[] | null;
  orderType: 'limit' | 'market';
  orderDirection: 'buy' | 'sell';
  amount: number;
  value: number;
  triggerPrice: number;
}

const initialState: ITradingOptions = {
  allActiveSymbols: null,
  orderType: 'limit',
  orderDirection: 'buy',
  amount: 0,
  value: 0,
  triggerPrice: 0,
};

export const tradingOptionsSlice = createSlice({
  name: 'tradingOptions',
  initialState,
  reducers: {
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setOrderDirection: (state, action) => {
      state.orderDirection = action.payload;
    },
    setTriggerPrice: (state, action) => {
      state.triggerPrice = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {
  setOrderType,
  setOrderDirection,
  setTriggerPrice,
  setAmount,
  setValue,
} = tradingOptionsSlice.actions;

export const selectTradingOptions = (state: RootState) => state.tradingOptions;

export default tradingOptionsSlice.reducer;
