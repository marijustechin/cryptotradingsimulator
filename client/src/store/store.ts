import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import authReducer from './features/user/authSlice';
import userInfoReducer from './features/user/userInfoSlice';
import allUsersReducer from './features/user/allUsersSlice';
import tradingOptionsReducer from './features/trading/tradingOptionsSlice';
import ordersReducer from './features/orders/ordersSlice';
import chartReducer from './features/trading/chartSlice';
import adminReducer from './features/admin/adminSlice';
import settingsReducer from './features/admin/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userInfoReducer,
    allUsers: allUsersReducer,
    tradingOptions: tradingOptionsReducer,
    orders: ordersReducer,
    chart: chartReducer,
    admin: adminReducer,
    settings: settingsReducer,
  },
});

// isvestiniai `RootState`,  `AppDispatch` ir `AppStore` is pacios stores
export type RootState = ReturnType<typeof store.getState>;
// isvesti tipai, pavyzdys is dokumentacijos:
// {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// jei programoje nenori naudoti nuogus `useDispatch` ir `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
