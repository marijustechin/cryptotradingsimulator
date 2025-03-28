import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IInstrument, ITicker } from '../../../types/tradingN';
import InstrumentService from '../../../services/InstrumentService';
import HelperService from '../../../services/HelperService';

interface ChartState {
  currentPrices: ITicker | null;
  selectedInterval: '15' | '30' | '60';
  selectedSymbol: string;
  selectedSymbolData: IInstrument | null;
  allSymbols: IInstrument[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChartState = {
  currentPrices: null,
  selectedInterval: '30',
  selectedSymbol: 'BTCUSDT',
  selectedSymbolData: null,
  allSymbols: null,
  status: 'idle',
  error: '',
};

export const getAllSymbols = createAsyncThunk<IInstrument[]>(
  'getSymbolData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await InstrumentService.getAllInstruments();
      return response;
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartInterval: (state, action) => {
      state.selectedInterval = action.payload;
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
      if (state.allSymbols) {
        state.selectedSymbolData =
          state.allSymbols.find((item) => item.id === state.selectedSymbol) ||
          null;
      }
    },
    setCurrentPrices: (state, action: PayloadAction<ITicker>) => {
      state.currentPrices = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSymbols.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllSymbols.fulfilled, (state, action) => {
        state.allSymbols = [...action.payload];
        const singleSymbol = state.allSymbols.find(
          (item) => item.id === state.selectedSymbol
        );
        if (singleSymbol) {
          state.selectedSymbolData = singleSymbol;
        }
        state.status = 'succeeded';
        state.error = '';
      })
      .addCase(getAllSymbols.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setChartInterval, setSymbol, setCurrentPrices } =
  chartSlice.actions;

export const getChartInterval = (state: RootState) =>
  state.chart.selectedInterval;

export const getChartSymbol = (state: RootState) => state.chart.selectedSymbol;
export const getCurrentPrices = (state: RootState) => state.chart.currentPrices;
export const getSelectedSymbolData = (state: RootState) =>
  state.chart.selectedSymbolData;
export const allActiveSymbols = (state: RootState) => state.chart.allSymbols;

export default chartSlice.reducer;
