import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer from "./features/user/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
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