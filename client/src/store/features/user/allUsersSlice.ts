import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserExtended } from '../../../types/user';
import { RootState } from '../../store';
import HelperService from '../../../services/HelperService';
import UserService from '../../../services/UserService';

interface IAllUsers {
  allUsersData: IUserExtended[] | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  sort: 'asc' | 'desc';
  limit: number;
  totalUsers: number;
  totalPages: number;
}

const initialState: IAllUsers = {
  allUsersData: undefined,
  status: 'idle',
  error: null,
  currentPage: 1,
  sort: 'asc',
  limit: 10,
  totalUsers: 0,
  totalPages: 0,
};

export const getAllUsersInfo = createAsyncThunk(
  'allUsers/getAllUsersInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.getAllUsers();
    } catch (e) {
      return rejectWithValue(HelperService.errorToString(e));
    }
  }
);

export const allUsersSlice = createSlice({
  name: 'allUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsersInfo.fulfilled, (state, action) => {
        state.allUsersData = [...action.payload.users];
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getAllUsersInfo.rejected, (state, action) => {
        console.log(action.payload);
      });
  },
});

export const selectAllUsers = (state: RootState) => state.allUsers.allUsersData;

export default allUsersSlice.reducer;
