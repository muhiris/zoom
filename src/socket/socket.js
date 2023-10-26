import { io } from "socket.io-client";
import axiosInstance from "../api/axios";
import { get } from "../redux/reuseable";

//socket.io
export const socket = io(axiosInstance.defaults.baseURL, {
  auth: async (cb) => {
    cb({
      token: await get("accessToken"),
    });
  },
});
