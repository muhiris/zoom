import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import {errorHandler} from "../../errorHanlder";
import {save} from "../../reuseable";



export const getPlans = createAsyncThunk(
  "plans/get",
  async (reqData = {}, {rejectWithValue}) => {
      try {
      const {data} = await axios.get('/plan/all');
      return data;
      } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
      }
  }
  );


export const getPlanById = createAsyncThunk(
  "plans/getById",
  async (id, {rejectWithValue}) => {
      try {
      const {data} = await axios.get(`/plan/${id}`);
      return data;
      } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
      }
  }
  );



