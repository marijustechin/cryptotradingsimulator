import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IGeneralInfo, IUserGeneral } from '../../../types/admin';
import HelperService from '../../../services/HelperService';
import AdminService from '../../../services/AdminService';
import { RootState } from '../../store';

interface AdminSliceState {
  userInfo: IUserGeneral | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminSliceState = {
  userInfo: null,
  status: 'idle',
  error: null,
};

export const getGeneralInfo = createAsyncThunk<IGeneralInfo>(
  'admin/getGeneralInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AdminService.getGeneralInfo();
      return response;
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGeneralInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getGeneralInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload.userInfo;
      });
  },
});

export const getAdminUserInfo = (state: RootState) => state.admin.userInfo;

export default adminSlice.reducer;
