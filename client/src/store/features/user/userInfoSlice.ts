import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserInfo } from '../../../types/user';
import HelperService from '../../../services/HelperService';
import UserService from '../../../services/UserService';
import { RootState } from '../../store';

interface IUserData {
  userData: IUserInfo | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IUserData = {
  userData: undefined,
  status: 'idle',
  error: null,
};

export const getInfo = createAsyncThunk(
  'user/getInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getUserInfo();
      return response;
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = { ...action.payload };
      })
      .addCase(getInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.status = 'idle';
      });
  },
});

export const selectUserInfo = (state: RootState) => state.user.userData;

export default userInfoSlice.reducer;
