import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import {errorHandler} from "../../errorHanlder";
import {save} from "../../reuseable";

export const createMeet = createAsyncThunk(
  "meet/type/create",
  async (reqData = {}, {rejectWithValue}) => {
    try {
      const {data} = await axios.post('/meet', reqData);
      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const getMeet = createAsyncThunk(
  "meet/id/get",
  async ({meetId}, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(`/meet/${meetId}`);
      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const updateMeet = createAsyncThunk(
  "meet/id/update",
  async ({meetId, data}, {rejectWithValue}) => {
    try {
      const {data: res} = await axios.put(`/meet/${meetId}`, data);
      return res;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const addAttendee = createAsyncThunk(
  "meet/id/join",
  async ({meetId}, {rejectWithValue}) => {
    try {
      const {data} = await axios.patch(`/meet/${meetId}/addAttendee`);
      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const joinMeet = createAsyncThunk(
  "meet/id/type/permission",
  async ({meetId, type  , passcode=null }, {rejectWithValue}) => {
    try {
      let passcodeQuery = '';
      if(passcode){
        passcodeQuery = `?passcode=${passcode}`;
      }
      const {data} = await axios.get(`/meet/${meetId}/${type}/join${passcodeQuery}` );
      console.log(data);
      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
)
