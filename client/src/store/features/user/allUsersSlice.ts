import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAllUsersInfo, IUserExtended } from '../../../types/user';
import { RootState } from '../../store';
import HelperService from '../../../services/HelperService';
import UserService from '../../../services/UserService';

interface IAllUsers {
  allUsersData: IUserExtended[] | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  sort: string;
  filter: string;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

const initialState: IAllUsers = {
  allUsersData: undefined,
  status: 'idle',
  error: null,
  currentPage: 1,
  sort: 'first_name:asc',
  filter: '',
  limit: 10,
  totalUsers: 0,
  totalPages: 0,
};

export const getAllUsersInfo = createAsyncThunk<
  IAllUsersInfo,
  void,
  { state: RootState }
>('allUsers/getAllUsersInfo', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const currentPage = state.allUsers.currentPage;
    const sort = state.allUsers.sort;
    const limit = state.allUsers.limit;
    const filter = state.allUsers.filter;
    const query =
      '?page=' +
      currentPage +
      '&limit=' +
      limit +
      '&sort=' +
      sort +
      '&filter=' +
      filter;

    return await UserService.getAllUsers(query);
  } catch (e) {
    return rejectWithValue(HelperService.errorToString(e));
  }
});

export const allUsersSlice = createSlice({
  name: 'allUsers',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<{ current: number }>) => {
      state.currentPage = action.payload.current;
    },
    setFilter: (state, action: PayloadAction<{ filter: string }>) => {
      state.filter = action.payload.filter;
    },
  },
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
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage, setFilter } = allUsersSlice.actions;

export const selectAllUsers = (state: RootState) => state.allUsers.allUsersData;
export const getTotalPages = (state: RootState) => state.allUsers.totalPages;
export const getCurrentPage = (state: RootState) => state.allUsers.currentPage;

export default allUsersSlice.reducer;
