import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ISettings } from '../../../types/settings';
import SettingsService from '../../../services/SettingsService';
import HelperService from '../../../services/HelperService';
import { RootState } from '../../store';

interface SettingsSliceState {
  limit_order_fee: number | null;
  market_order_fee: number | null;
  fake_users_count: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
}

const initialState: SettingsSliceState = {
  limit_order_fee: null,
  market_order_fee: null,
  fake_users_count: null,
  status: 'idle',
  error: null,
  message: null,
};

export const getSettings = createAsyncThunk<ISettings>(
  'settings/getSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SettingsService.getSettings();
      return response;
    } catch (error) {
      return rejectWithValue(HelperService.errorToString(error));
    }
  }
);

export const generateActivity = createAsyncThunk<string>(
  'settings/generateActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SettingsService.generateFakeActivity();
      return response;
    } catch (error) {
      return rejectWithValue(HelperService.errorToString(error));
    }
  }
);

export const generateUsers = createAsyncThunk<
  string,
  { usersCount?: number; defaultPassword?: string }
>(
  'settings/generateUsers',
  async ({ usersCount, defaultPassword }, { rejectWithValue }) => {
    try {
      const response = await SettingsService.generateFakeUsers(
        usersCount,
        defaultPassword
      );
      return response;
    } catch (error) {
      return rejectWithValue(HelperService.errorToString(error));
    }
  }
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettingsMessage: (state, action) => {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.limit_order_fee = action.payload.limit_order_fee;
        state.market_order_fee = action.payload.market_order_fee;
        state.fake_users_count = action.payload.fake_users_count;
        state.status = 'idle';
        state.error = null;
        state.message = null;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(generateActivity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateActivity.fulfilled, (state, action) => {
        state.message = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(generateActivity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(generateUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateUsers.fulfilled, (state, action) => {
        state.message = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(generateUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSettingsMessage } = settingsSlice.actions;

export const selectLimitFee = (state: RootState) =>
  state.settings.limit_order_fee;
export const selectMarketFee = (state: RootState) =>
  state.settings.market_order_fee;
export const selectFakeUsers = (state: RootState) =>
  state.settings.fake_users_count;

export const getSettingsStatus = (state: RootState) => state.settings.status;
export const getSettingsMessage = (state: RootState) => state.settings.message;

export default settingsSlice.reducer;
