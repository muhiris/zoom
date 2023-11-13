import Call from "./screens/Call";
import LandingPage from "./screens/LandingPage";
import ProductDeatils from "./screens/ProductDeatils";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Pricing from "./screens/Pricing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomPlan from "./screens/CustomPlan";
import { ToastContainer, toast } from "react-toast";
import "react-toastify/dist/ReactToastify.css";
import JoinCall from "./screens/joinCall";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./redux/slice/user/userSlice";
import Chat from "./screens/Chat";
import { useSocket } from "./context/socketContext";
import { addChat, addMessage } from "./redux/slice/chat/chatSlice";
import { getAllSchedule } from "./redux/slice/schedule/scheduleAction";
import { getAllChat } from "./redux/slice/chat/chatAction";
import Meetings from "./screens/Meetings";
import { getPlans } from "./redux/slice/plans/PlanAction";
import StripePaymentElement from "./screens/StripePaymentElement";
import { getAllFeatures } from "./redux/slice/feature/featureAction";




export default function App() {

  const dispatch = useDispatch();
  const socket = useSocket();
  const { userInfo } = useSelector(state => state.user);
  const { loading: scheduleLoading, schedules, error: scheduleError } = useSelector(state => state.schedule);
  const { loading: chatsLoading, chats, error: chatsError, hasNextPage: chatsHasNextPage } = useSelector(state => state.chat);
  const { loading: plansLoading, plans, error: plansError, success: plansSuccess } = useSelector(state => state.plan);
  const { loading: featuresLoading, features, error: featuresError, success: featuresSuccess } = useSelector(state => state.feature);



  //to get usrer credentials after each refresh
  useEffect(() => {

    try {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser && loggedInUser !== "undefined" && loggedInUser !== null && typeof loggedInUser === "string") {
        const foundUser = JSON.parse(loggedInUser);
        dispatch(setCredentials({ data: foundUser }))
      }
    } catch (err) {
      console.log(err);
    }
  }, []);


  // Socket Listeners =====================================
  useEffect(() => {

    if (socket && userInfo?._id) {
      socket.on('connect', () => {
        socket.emit('user-connected', { userName: userInfo.name, userId: userInfo._id, userEmail: userInfo.email })
      });

      socket.on("message", ({ data, chatId }) => {
        console.log("message received: ", data);
        dispatch(addMessage({ data: { messageData: data, chatId } }))
      });


      socket.on("chatCreated", ({ chat, err }) => {
        dispatch(addChat({ data: { chatData: chat } }))
        if (err) {
          toast.error(err);
        }
        else {
          socket.emit('joinChat', { chatId: chat._id });
          toast.success("Chat Created Successfully");
        }
      })
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off("message");
        socket.off("chatCreated");
      }
    }

  }, [socket])



  //get all chats and schedules after user is logged in
  useEffect(() => {


    if (userInfo?._id) {

      if (schedules.length <= 0 && !scheduleLoading) {
        dispatch(getAllSchedule({ filter: { status: { $ne: "pending" } }, limit: 5 }));
      }

      if (chats.length <= 0 && !chatsLoading) {
        dispatch(getAllChat({ limit: 30 }));
      }

      if (plans.length == 0 && !plansLoading) {
        dispatch(getPlans());
      }

      if(features.length ==0 && !featuresLoading){
        dispatch(getAllFeatures())
      }

    }

  }, [userInfo?._id])


  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/custom" element={<CustomPlan />} />
        <Route path="/details" element={<ProductDeatils />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/call/:id" element={<Call />} />
        <Route path="/joinCall" element={<JoinCall />} />
        <Route path="/plans" element={<Pricing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/myMeetings" element={<Meetings />} />
        <Route path="/payment" element={<StripePaymentElement />} />

      </Routes>
      <ToastContainer delay={4000} />
    </div>
  );
}
