// import {createSlice} from "@reduxjs/toolkit";
// import { getPlans } from "./PlanAction";



// const initialState = {
//   loading: false,
//   plans:[],
//   error: null,
//   success: false,
// };

// const planSlice = createSlice({
//   name: "plan",
//   initialState: initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(getPlans.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getPlans.fulfilled, (state, {payload}) => {
//         state.loading = false;
//         state.plans = payload.data;
//         state.success = payload.success;
//       })
//       .addCase(getPlans.rejected, (state, {payload}) => {
//         state.loading = false;
//         state.error = payload;
//       })
     
//   },
// });

// export default planSlice.reducer;
