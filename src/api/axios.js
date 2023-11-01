import axios from "axios";
import { get, save } from "../redux/reuseable";

// export const baseUrl = "http://192.168.1.171:5000";
// export const baseUrl = "https://hammerhead-app-6nzi4.ondigitalocean.app";
// export const baseUrl = "https://zoombackend-production.up.railway.app";
// export const baseUrl = "http://192.168.1.173:5000";
// export const baseUrl = "http://192.168.1.173:5000";
export const baseUrl = "http://172.19.112.1:5000";


// Create axiosInstance with default configuration
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for token refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await get("refreshToken");

      if (refreshToken) {
        try {
          const res = await axiosInstance.post("/auth/RefreshAccessToken", {
            refreshToken,
          });

          if (res.status === 201 || res.status === 200) {
            const newAccessToken = res.data.accessToken;
            await save("accessToken", newAccessToken);
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Handle any errors that occur during token refresh
          console.error("Error refreshing access token:", refreshError);
          return Promise.reject(error);
        }
      }
    }

    // If no refresh token or refresh failed, reject the request
    return Promise.reject(error);
  }
);

export default axiosInstance;
