import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserInfo } from '../../../types/user';
import HelperService from '../../../services/HelperService';
import UserService from '../../../services/UserService';

interface IUserData {
  userData: IUserInfo | undefined;
}

const initialState: IUserData = {
  userData: undefined,
};

export const getInfo = createAsyncThunk(
  'user/getInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getUserInfo();
      console.log(response);
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
      .addCase(getInfo.pending, (state, action) => {
        console.log(state);
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        console.log(state);
      })
      .addCase(getInfo.rejected, (state, action) => {
        console.log(state);
      });
  },
});
