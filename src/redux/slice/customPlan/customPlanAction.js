import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import { errorHandler } from "../../errorHanlder";
import { save } from "../../reuseable";



export const createCustomPlan = createAsyncThunk(
    "customPlan/create",
    async (reqData = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/customPlan', reqData);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
);


