import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import authReducer from './features/user/authSlice';
import userInfoReducer from './features/user/userInfoSlice';
import allUsersReducer from './features/user/allUsersSlice';
import assetsReducer from './features/crypto/assetsSlice';
import tradingOptionsReducer from './features/trading/tradingOptionsSlice';
import tradeOptionsReducer from './features/trading/tradeOptionsSlice';
<<<<<<< HEAD
import OrdersReducer from "./features/orders/ordersSlice";
=======
import chartReducer from './features/trading/chartSlice';
>>>>>>> 6fcc553f947cfc027ea16fbfba1c6c9ae5fce51a

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userInfoReducer,
    allUsers: allUsersReducer,
    assets: assetsReducer,
    tradeOptions: tradeOptionsReducer,
    tradingOptions: tradingOptionsReducer,
<<<<<<< HEAD
    orders: OrdersReducer,
=======
    chart: chartReducer,
>>>>>>> 6fcc553f947cfc027ea16fbfba1c6c9ae5fce51a
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
