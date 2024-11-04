import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")) || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      // const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      // if (storedUser) state.loggedInUser = storedUser;
      // else {
      state.loggedInUser = action.payload;
      localStorage.setItem("loggedInUser", JSON.stringify(action.payload));
      // }
    },
    logout: (state) => {
      state.loggedInUser = null;
      localStorage.removeItem("loggedInUser");
    },
  },
});

export const { setLoggedInUser, logout } = userSlice.actions;

export default userSlice.reducer;
