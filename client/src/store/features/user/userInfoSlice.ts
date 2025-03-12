import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo } from '../../../types/user';
import HelperService from '../../../services/HelperService';
import UserService from '../../../services/UserService';
import { RootState } from '../../store';

interface IUpdateUserInfoProps {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone_number: string;
}

interface IUserData {
  userData: IUserInfo | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IUserData = {
  userData: undefined,
  status: 'idle',
  error: '',
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

export const updateUserInfo = createAsyncThunk<IUserInfo, IUpdateUserInfoProps>(
  'user/updateUserInfo',
  async (
    { first_name, last_name, email, address, phone_number },
    { rejectWithValue }
  ) => {
    try {
      const response = await UserService.updateUser(
        first_name,
        last_name,
        email,
        address,
        phone_number
      );
      return response;
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfoError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
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
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateUserInfo.fulfilled,
        (state, action: PayloadAction<IUserInfo>) => {
          state.status = 'succeeded';
          state.userData = { ...action.payload };
          state.error = '';
        }
      )
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'idle';
      });
  },
});

export const { setInfoError } = userInfoSlice.actions;

export const selectUserInfo = (state: RootState) => state.user.userData;
export const getUserInfoStatus = (state: RootState) => state.user.status;
export const getUserInfoError = (state: RootState) => state.user.error;

export default userInfoSlice.reducer;
