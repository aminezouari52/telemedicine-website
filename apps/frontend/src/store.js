import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import searchReducer from "./reducers/searchReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});
