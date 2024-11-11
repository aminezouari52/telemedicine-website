import { createSlice } from "@reduxjs/toolkit";
import { isBrowser } from "@/utils";

const initialState = {
  user: null,
};

if (isBrowser()) {
  if (localStorage.getItem("user")) {
    initialState.user = JSON.parse(localStorage.getItem("user"));
  } else {
    initialState.user = null;
  }
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (isBrowser()) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      if (isBrowser()) {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
