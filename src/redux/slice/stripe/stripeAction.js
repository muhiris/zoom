import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import { errorHandler } from "../../errorHanlder";


export const createPaymentIntent = createAsyncThunk(
    "stripe/payment-intent/create",
    async ({ planId,planType }, { rejectWithValue }) => {
        try {
            console.log("planId", planId);
            const { data } = await axios.post("/stripe/create-paymentIntent", { planId,planType });
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
)

