import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import {errorHandler} from "../../errorHanlder";
import {save} from "../../reuseable";

export const createSubscription = createAsyncThunk(
  "meet/type/create",
  async (reqData = {}, {rejectWithValue}) => {
    try {
      const {data} = await axios.post('/subscription', reqData);
      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);



