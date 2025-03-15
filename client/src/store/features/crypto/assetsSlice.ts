import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICryptoAsset } from '../../../types/crypto';
import { RootState } from '../../store';
import HelperService from '../../../services/HelperService';
import AssetService from '../../../services/assetService';

interface IAssets {
  assets: ICryptoAsset[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IAssets = {
  assets: [],
  status: 'idle',
  error: '',
};

export const getAssets = createAsyncThunk<
  ICryptoAsset[],
  void,
  { state: RootState }
>('assets/getAssets', async (_, { rejectWithValue }) => {
  try {
    const response = await AssetService.getAssets();

    return response;
  } catch (error) {
    return rejectWithValue(HelperService.errorToString(error));
  }
});

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    updateAssets: (state, action: PayloadAction<ICryptoAsset[]>) => {
      state.assets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAssets.fulfilled, (state, action) => {
        state.assets = [...action.payload];
        state.status = 'succeeded';
        state.error = '';
      })
      .addCase(getAssets.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { updateAssets } = assetsSlice.actions;

export const selectAssets = (state: RootState) => state.assets.assets;

export default assetsSlice.reducer;
