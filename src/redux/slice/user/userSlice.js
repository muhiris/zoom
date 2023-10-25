import {createSlice} from "@reduxjs/toolkit";
import {get, remove, save} from "../../reuseable";
import {
  getUserProfile,
  googleAuth,
  registerUser,
  resetPassword,
  updateUserProfile,
  userLogin,
} from "./userAction";

const initialState = {
  loading: false,
  userInfo: {},
  accessToken: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout: state => {
      remove("accessToken");
      remove("refreshToken");
      state.userInfo = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.userInfo = payload.data.user;
        state.accessToken = payload.data.accessToken;
        state.success = payload.success;
      })
      .addCase(userLogin.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.userInfo = payload.data.user;
        state.accessToken = payload.data.accessToken;
        state.success = payload.success;
      })
      .addCase(registerUser.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(googleAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.userInfo = payload.data.user;
        state.accessToken = payload.data.accessToken;
        state.success = payload.success;
      })
      .addCase(googleAuth.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.userInfo = payload.data;
        state.success = payload.success;
      })
      .addCase(getUserProfile.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.userInfo = payload.data;
        state.success = payload.success;
      })
      .addCase(updateUserProfile.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.success = payload.success;
      })
      .addCase(resetPassword.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const {logout} = authSlice.actions;

export default authSlice.reducer;
