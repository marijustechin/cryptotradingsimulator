import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IInstrument, ITicker } from '../../../types/tradingN';
import InstrumentService from '../../../services/InstrumentService';
import HelperService from '../../../services/HelperService';

interface ChartState {
  currentPrices: ITicker | null;
  selectedInterval: '15' | '30' | '60';
  selectedSymbol: string;
  selectedSymbolData: {
    name: string;
    icon: string;
    code: string;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChartState = {
  currentPrices: null,
  selectedInterval: '30',
  selectedSymbol: 'BTCUSDT',
  selectedSymbolData: null,
  status: 'idle',
  error: '',
};

export const getSymbolData = createAsyncThunk<
  IInstrument,
  void,
  { state: RootState }
>('getSymbolData', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const id = state.chart.selectedSymbol;
    const response = await InstrumentService.getInstrument(id);
    return response;
  } catch (e) {
    return rejectWithValue(HelperService.errorToString(e));
  }
});

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartInterval: (state, action) => {
      state.selectedInterval = action.payload;
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
    },
    setCurrentPrices: (state, action: PayloadAction<ITicker>) => {
      state.currentPrices = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSymbolData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSymbolData.fulfilled, (state, action) => {
        const data = {
          name: action.payload.name,
          code: action.payload.code,
          icon: action.payload.icon,
        };
        state.selectedSymbolData = { ...data };
        state.status = 'succeeded';
        state.error = '';
      })
      .addCase(getSymbolData.rejected, (state, action) => {
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

export default chartSlice.reducer;
