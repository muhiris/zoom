import {createSlice} from "@reduxjs/toolkit";
import { createCustomPlan } from "./customPlanAction";



const initialState = {
  loading: false,
  error: null,
  success: false,
};

const customPlanSlice = createSlice({
  name: "customPlan",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createCustomPlan.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomPlan.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.success = payload.success;
      })
      .addCase(createCustomPlan.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
     
  },
});

export default customPlanSlice.reducer;
