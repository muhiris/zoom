//write basic form react component
import React from "react";
import google from "../assets/google.svg";
import rightImage from "../assets/humanSignin.png";
import section from "../assets/Section.png";
import InputField from "../components/InputField";

import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slice/user/userAction";
import { toast } from "react-toast";
import axiosInstance from "../api/axios";
//functional component
const SignUp = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading:authLoading, userInfo, error:authError} = useSelector(state => state.user);


  const handleGoogleSignIn = () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google-web`;
  }

  const handleLocalSignUp = (e) => {
    e.preventDefault();
    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
      name: e.target.name.value,
      phoneNo: e.target.phoneNo.value,
    }

    dispatch(registerUser(payload)).then((res)=>{
      if(registerUser.fulfilled.match(res)){
        toast.success("Registration Successfull");
        navigate("/");
      }
    })

  }


  return (
    <div className="overflow-hidden h-[100vh] flex items-center justify-center lg:justify-between">
      <div className="flex-start flex-col lg:ml-40   lg:min-w-[30%] ">
        <div>
          <h1 className="text-4xl font-medium text-gray-900 mb-4">Sign Up</h1>
        </div>

        <form onSubmit={handleLocalSignUp} className="flex flex-col  w-full ">
          <InputField
            label={"Name*"}
            type={"text"}
            placeholder={"Enter Name"}
            id={"name"}
            name={"name"}
          />
          <InputField
            label={"Email*"}
            type={"text"}
            placeholder={"Enter Email"}
            id={"email"}
            name={"email"}
          />
          <InputField
            label={"Password*"}
            type={"password"}
            placeholder={"Enter Password"}
            id={"password"}
            name={"password"}
          />
          <InputField
            label={"Phone Number*"}
            type={"text"}
            placeholder={"Phone Number"}
            id={"phoneNo"}
            name={"phoneNo"}
          />

          {/* <input
            type="submit"
            id="button"
            value="Sign In"
            className="mt-6 bg-primary text-white px-4 py-2 rounded-md"
          /> */}
          <Button text={"Sign Up"} type={"Submit"} loading={authLoading} style={{marginTop:24}} />
          <div onClick={handleGoogleSignIn} className="flex-center mt-4 border  border-gray-300 rounded-md">
            <img src={google} alt="" />
            <input
              type="button"
              id="button"
              value="Sign In with Google"
              className="px-4 py-2 text-black"
            />
          </div>
          <div className="flex-center mt-4">
            <p>Already have an account?</p>
            <Link to="/login" className="text-primary ml-2">
              Log in
            </Link>
          </div>
        </form>
      </div>

      <img src={section} alt="" className="w-[50vw] hidden lg:block" />
    </div>
  );
};

export default SignUp;
