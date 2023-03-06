import { createSlice } from "@reduxjs/toolkit";

export const auth = createSlice({
  name: "auth",
  initialState: {
    userId: "",
    userName: "",
    isAdmin: false,
    isLoggedIn: false,
    dailyCalorieLimit: 0,
    monthlyPriceLimit: 0,
  },
  reducers: {
    setAuth: (state, action) => {
      return action.payload;
    },
    setLoggedIn: (state, action) => ({
      ...state,
      isLoggedIn: action.payload,
    }),
    logout: () => ({
      userId: "",
      userName: "",
      isAdmin: false,
      isLoggedIn: false,
      dailyCalorieLimit: 0,
      monthlyPriceLimit: 0,
    }),
  },
});

export const { setAuth, setLoggedIn, logout } = auth.actions;

export const getUserId = (state) => state.auth.userId;
export const getUserName = (state) => state.auth.userName;
export const getIsAdmin = (state) => state.auth.isAdmin;
export const getLoginStatus = (state) => state.auth.isLoggedIn;

export default auth.reducer;
