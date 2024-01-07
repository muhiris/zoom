//write basic form react component
import React, { useEffect, useState } from "react";
import Google from "../assets/Svgs/Google";
import rightImage from "../assets/humanSignin.png";
import InputField from "../components/InputField";
import "../index.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/slice/user/userAction";
import { toast } from "react-toast";
import Button from "../components/Button";
import axiosInstance from "../api/axios";
import Button2 from "../components/Button2";
import { setCredentials } from "../redux/slice/user/userSlice";
//functional component
const SignIn = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading, userInfo, error: authError } = useSelector(state => state.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from  = location.state?.from || null;
  const user = queryParams.get("user");
  const accessToken = queryParams.get("accessToken");
  const refreshToken = queryParams.get("refreshToken");
  const googleError = queryParams.get("error");
  const [loading, setLoading] = useState(false);


  const handleLocalSignIn = (e) => {
    try {


      e.preventDefault();
      const payload = {
        email: e.target.email.value,
        password: e.target.password.value,
      }

      dispatch(userLogin({ ...payload })).then((res) => {
        if (userLogin.fulfilled.match(res)) {
          console.log(res);
          toast.success("Login Successfull");
          if (from) {
            navigate(from);
          } else {
            navigate("/");
          }
        }
      })
    } catch (err) {
      console.log(err);
    }

  }

  //==================== GOOGLE SIGN IN ====================//
  const handleGoogleSignIn = () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google-web`;
  }

  useEffect(() => {
    setLoading(true);
    if (user && accessToken && refreshToken) {
      dispatch(setCredentials({ user, accessToken, refreshToken }));
    } else if (googleError) {
      toast.error("Google Login Failed");
    }
  }, []);

  useEffect(() => {
    if (userInfo?._id !== undefined) {
      navigate("/");
    }
    setLoading(false);
  }, [userInfo]);


  //============================================================


  return (
    <div className="overflow-hidden h-[100vh] flex items-center justify-center lg:justify-between ">
      <div className="flex-start flex-col lg:ml-40  lg:min-w-[30%]  ">
        <div>
          <h1 className="text-4xl font-medium text-gray-900">Welcome Back</h1>
          <p className="font-normal text-gray-600">
            Welcome Back, please enter your details.
          </p>
        </div>

        <form onSubmit={handleLocalSignIn} className="flex flex-col w-full">
          <InputField
            label={"Email"}
            name={"email"}
            type={"text"}
            placeholder={"Enter Email"}
            id={"email"}
          />
          <InputField
            label={"Password"}
            email={"password"}
            type={"password"}
            placeholder={"Enter Password"}
            id={"password"}
          />
          <div className="flex-between my-4 gap-6 ">
            <div className="flex-center gap-2">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="text-gray-700 text-sm">
                Remember for 30 days
              </label>
            </div>
            <a href="#" className="text-primary text-sm">
              Forgot Password
            </a>
          </div>

          {/* <input
            type="submit"
            id="button"
            value="Sign In"
            className="bg-primary text-white px-4 py-2 rounded-md"
          /> */}
          <Button type={"submit"} text={"Sign In"} loading={authLoading} />
          <Button2
            onClick={handleGoogleSignIn}
            style={{
              backgroundColor: "#fff",
              borderColor: "#0000002e",
              marginTop: 10,
              padding: 7

            }}
            loading={loading}
            disabled={authLoading}
            textStyle={{ color: "#000000", fontWeight: "400", fontSize: 17 }} ICON={Google} text={"Sign In with Google"} />

          <div className="flex-center mt-4">
            <p>Don’t have an account?</p>
            <Link to="/signup" className="text-primary ml-2">
              Signup
            </Link>
          </div>
        </form>
      </div>

      <img src={rightImage} alt="" className="w-[50vw] hidden lg:block" />
    </div>
  );
};

export default SignIn;
