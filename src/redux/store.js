import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import userReducer from "./slice/user/userSlice";
import meetReducer from "./slice/meet/meetSlice";
import scheduleReducer from "./slice/schedule/scheduleSlice";
import chatReducer from "./slice/chat/chatSlice";
import subscriptionReducer from "./slice/subscription/subscriptionSlice";

const rootReducer = combineReducers({
  user: userReducer,
  meet: meetReducer,
  schedule: scheduleReducer,
  chat: chatReducer,
  subscription : subscriptionReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
