import {createSlice} from "@reduxjs/toolkit";
import {get, save} from "../../reuseable";
import { createSubscription } from "./subscriptionAction";


const initialState = {
  loading: false,
  subscription: {},
  error: null,
  success: false,
};

const meetSlice = createSlice({
  name: "subscription",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createSubscription.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.meet = payload.data;
        state.success = payload.success;
      })
      .addCase(createSubscription.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
   
  },
});

export default meetSlice.reducer;
