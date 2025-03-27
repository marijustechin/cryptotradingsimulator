import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalUsers: 0,
  totalOrders: 0,
  appRevenue: 0,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
});

export default adminSlice.reducer;
