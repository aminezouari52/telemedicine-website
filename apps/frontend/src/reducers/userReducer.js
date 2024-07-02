import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedInUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    logout: (state) => {
      state.loggedInUser = null;
    },
  },
});

export const { setLoggedInUser, logout } = userSlice.actions;

export default userSlice.reducer;
