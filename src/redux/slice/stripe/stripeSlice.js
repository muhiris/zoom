import {createSlice} from "@reduxjs/toolkit";
import { createPaymentIntent } from "./stripeAction";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const stripeSlice = createSlice({
  name: "stripe",
  initialState: initialState,
  reducers: {
    logout:()=>{
      return initialState;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createPaymentIntent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.success = payload.success;
      })
      .addCase(createPaymentIntent.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
  },
});




export const {logout} = stripeSlice.actions;

export default stripeSlice.reducer;
