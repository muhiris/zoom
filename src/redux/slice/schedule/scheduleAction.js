import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import { errorHandler } from "../../errorHanlder";

export const createSchedule = createAsyncThunk(
    "schedule/create",
    async (reqData = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/schedule', reqData);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
);


export const getAllSchedule = createAsyncThunk(
    "schedule/getAll",
    async ({filter={},cursor=null,limit=20}, { rejectWithValue }) => {
        try {
            
            let qurey = `?limit=${limit}`;
            if(cursor) qurey += `&cursor=${cursor}`;
            if(filter) qurey += `&filter=${JSON.stringify(filter)}`;
            
            const { data } = await axios.get(`/schedule${qurey}`);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
);


export const updateSchedule = createAsyncThunk(
    "schedule/update",
    async ({ scheduleId, data }, { rejectWithValue }) => {
        try {
            const { data: res } = await axios.put(`/schedule/${scheduleId}`, data);
            return res;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
)


export const getScheduleById = createAsyncThunk(
    "schedule/getById",
    async ({ scheduleId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/schedule/${scheduleId}`);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
)


export const deleteSchedule = createAsyncThunk(
    "schedule/delete",
    async ({ scheduleId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/schedule/${scheduleId}`);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
)






