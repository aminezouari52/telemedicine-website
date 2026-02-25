import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/reducers/userReducer";
import searchReducer from "@/reducers/searchReducer";

export const store = configureStore({
  reducer: {
    userReducer,
    searchReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
