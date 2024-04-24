import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const googleLogin = createSlice({
  name: "googleAuth",
  initialState,
  reducers: {
    setGCredentials: (state, action) => {
      state.userInfo = action.payload;
      console.log("Set Cred : ", state.userInfo);
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});
export const { setGCredentials, logout } = googleLogin.actions;

export default googleLogin.reducer;
