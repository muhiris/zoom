import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import userReducer from "./slice/user/userSlice";
import meetReducer from "./slice/meet/meetSlice";
import scheduleReducer from "./slice/schedule/scheduleSlice";
import chatReducer from "./slice/chat/chatSlice";
import subscriptionReducer from "./slice/subscription/subscriptionSlice";
import planRouter from "./slice/plans/PlanSlice";
import stripeRouter from "./slice/stripe/stripeSlice";
import customPlanRouter from "./slice/customPlan/customPlanSlice";
import featureRouter from "./slice/feature/featureSlice";

const rootReducer = combineReducers({
  user: userReducer,
  meet: meetReducer,
  schedule: scheduleReducer,
  chat: chatReducer,
  subscription : subscriptionReducer,
  plan:planRouter,
  stripe: stripeRouter,
  customPlan: customPlanRouter,
  feature: featureRouter,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
