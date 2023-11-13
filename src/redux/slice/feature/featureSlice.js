import {createSlice} from "@reduxjs/toolkit";
import { getAllFeatures } from "./featureAction";



const initialState = {
  loading: false,
  features:[],
  error: null,
  success: false,
};

const featureSlice = createSlice({
  name: "feature",
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllFeatures.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFeatures.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.features = payload.data;
        state.success = payload.success;
      })
      .addCase(getAllFeatures.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      
  },
});

export default featureSlice.reducer;
