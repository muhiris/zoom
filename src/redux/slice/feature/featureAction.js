import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import { errorHandler } from "../../errorHanlder";
import { save } from "../../reuseable";



export const getAllFeatures = createAsyncThunk(
    "feature/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/features');
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
);





