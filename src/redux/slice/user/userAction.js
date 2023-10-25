import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import {errorHandler} from "../../errorHanlder";
import {save} from "../../reuseable";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({email, password}, {rejectWithValue}) => {
    try {
      const {data} = await axios.post("/auth/login", {email, password});
      if(data?.success){
        save("accessToken", data.data.accessToken);
        save("refreshToken", data.data.refreshToken);
        save("user", JSON.stringify(data.data.user));
      }
      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/signup",
  async ({email, password, name, phoneNo}, {rejectWithValue}) => {
    try {
      const {data} = await axios.post("/auth/signup", {
        email,
        password,
        name,
        phoneNo,
      });

      save("accessToken", data.data.accessToken);
      save("refreshToken", data.data.refreshToken);
      save("user",JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/profile/get",
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await axios.get("/user/profile");

      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/profile/update",
  async (reqData, {rejectWithValue}) => {
    try {
      //* reqData can have any of the following properties: name, avatar, age

      const {data} = await axios.put("/user/profile", reqData);

      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({password}, {rejectWithValue}) => {
    try {
      const {data} = await axios.put("/user/resetPassword", {
        password,
      });

      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
);

export const googleAuth = createAsyncThunk(
  "auth/google",
  async (reqData, {rejectWithValue}) => {
    try {
      const {data} = await axios.post("/auth/google", reqData);

      save("accessToken", data.data.accessToken);
      save("refreshToken", data.data.refreshToken);
      save("user", JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      let err = errorHandler(error);
      return rejectWithValue(err);
    }
  }
)