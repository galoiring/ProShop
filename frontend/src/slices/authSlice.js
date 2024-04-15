import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/google/callback");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      console.log(action.payload);
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.token = action.payload.token;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
