import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import HelperService from '../../../services/HelperService';
import { IInstrument } from '../../../types/crypto';
import AssetService from '../../../services/AssetService';

interface ITradingOptions {
  orderType: 'limit' | 'market';
  orderDirection: 'buy' | 'sell';
  amount: number;
  triggerPrice: number;
  chartInterval: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  instrument: string;
  singleInstrument: IInstrument | null;
  allInstruments: IInstrument[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ITradingOptions = {
  orderType: 'limit',
  orderDirection: 'buy',
  amount: 0,
  triggerPrice: 0,
  chartInterval: 'hours',
  instrument: 'BTC-USD',
  singleInstrument: null,
  allInstruments: null,
  status: 'idle',
  error: '',
};

export const getInstruments = createAsyncThunk<IInstrument[]>(
  'tradingOptions/getInstruments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AssetService.getInstruments();
      return response;
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const tradingOptionsSlice = createSlice({
  name: 'tradingOptions',
  initialState,
  reducers: {
    setChartInterval: (state, action) => {
      state.chartInterval = action.payload;
    },
    setInstrument: (state, action: PayloadAction<string>) => {
      state.instrument = action.payload;
      const single = state.allInstruments?.find(
        (item) => item.id === action.payload
      );
      if (single) {
        state.singleInstrument = single;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInstruments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getInstruments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allInstruments = action.payload;

        state.error = '';
        const single = action.payload.find(
          (item) => item.id === state.instrument
        );
        if (single) {
          state.singleInstrument = single;
        }
      })
      .addCase(getInstruments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setChartInterval, setInstrument } = tradingOptionsSlice.actions;

export const selectTradingOptions = (state: RootState) => state.tradingOptions;
export const getChartInterval = (state: RootState) =>
  state.tradingOptions.chartInterval;
export const getInstrument = (state: RootState) =>
  state.tradingOptions.instrument;
export const getAllInstruments = (state: RootState) =>
  state.tradingOptions.allInstruments;
export const getSingleInstrument = (state: RootState) =>
  state.tradingOptions.singleInstrument;

export default tradingOptionsSlice.reducer;
