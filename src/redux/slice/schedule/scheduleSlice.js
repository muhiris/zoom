import {createSlice} from "@reduxjs/toolkit";
import {get, save} from "../../reuseable";
import { createSchedule, deleteSchedule, getAllSchedule, getScheduleById, updateSchedule } from "./scheduleAction";


const initialState = {
  loading: false,
  schedules:[],
  hasNextPage: false,
  error: null,
  success: false,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder
      .addCase(createSchedule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.schedules = [payload.data, ...state.schedules];
        state.success = payload.success;
      })
      .addCase(createSchedule.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getAllSchedule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSchedule.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.schedules = [...state.schedules, ...payload.data.schedules];
        state.hasNextPage = payload.data.hasNextPage;
        state.success = payload.success;
      })
      .addCase(getAllSchedule.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getScheduleById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleById.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.success = payload.success;
      })
      .addCase(getScheduleById.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateSchedule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, {payload}) => {
        state.loading = false;
        let temp = [...state.schedules];
        let index = temp.findIndex((schedule)=>schedule._id === payload.data._id);
        temp[index] = payload.data;
        state.schedules = temp;
        state.success = payload.success;
      })
      .addCase(updateSchedule.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteSchedule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, {payload}) => {
        state.loading = false;
        let temp = state.schedules.filter((schedule)=>schedule._id !== payload.data._id);
        state.schedules = temp;
        state.success = payload.success;
      })
      .addCase(deleteSchedule.rejected, (state, {payload}) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default scheduleSlice.reducer;
