import {createSlice} from "@reduxjs/toolkit";
import {get, save} from "../../reuseable";
import {createMeet, getMeet, joinMeet, updateMeet} from "./meetAction";

const initialState = {
  loading: false,
  meet: {},
  error: null,
  success: false,
};

const meetSlice = createSlice({
  name: "meet",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createMeet.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeet.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.meet = payload.data;
        state.success = payload.success;
      })
      .addCase(createMeet.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getMeet.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeet.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.meet = payload.data;
        state.success = payload.success;
      })
      .addCase(getMeet.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateMeet.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMeet.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.meet = payload.data;
        state.success = payload.success;
      })
      .addCase(updateMeet.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(joinMeet.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinMeet.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.meet = payload.data.meet;
        state.success = payload.success;
      })
      .addCase(joinMeet.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default meetSlice.reducer;
