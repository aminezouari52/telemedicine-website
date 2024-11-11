import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/reducers/userReducer";
import searchReducer from "@/reducers/searchReducer";

export const store = configureStore({
  reducer: {
    userReducer,
    searchReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
});
