import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface ITradeOptions {
  orderType: 'limit' | 'market';
  orderDirection: 'buy' | 'sell';
}

const initialState: ITradeOptions = {
  orderType: 'limit',
  orderDirection: 'buy',
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
  },
});

export const { setOrderType, setOrderDirection } = tradeOptionsSlice.actions;

export const selectTradeOptions = (state: RootState) => state.tradeOptions;

export default tradeOptionsSlice.reducer;
