//write basic form react component
import React from "react";
import google from "../assets/google.svg";
import rightImage from "../assets/humanSignin.png";
import InputField from "../components/InputField";
import "../index.css";
//functional component
const SignIn = () => {
  return (
    <div className="overflow-hidden h-[100vh] flex items-center justify-center lg:justify-between ">
      <div className="flex-start flex-col lg:ml-40  lg:min-w-[30%]  ">
        <div>
          <h1 className="text-4xl font-medium text-gray-900">Welcome Back</h1>
          <p className="font-normal text-gray-600">
            Welcome Back, please enter your details.
          </p>
        </div>

        <form action="/home" className="flex flex-col  w-full   ">
          <InputField
            label={"Email"}
            type={"text"}
            placeholder={"Enter Email"}
            id={"email"}
          />
          <InputField
            label={"Password"}
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

          <input
            type="submit"
            id="button"
            value="Sign In"
            className="bg-primary text-white px-4 py-2 rounded-md"
          />
          <div className="flex-center mt-4 border  border-gray-300 rounded-md">
            <img src={google} alt="" />
            <input
              type="submit"
              id="button"
              value="Sign In with Google"
              className="px-4 py-2 text-black"
            />
          </div>
          <div className="flex-center mt-4">
            <p>Don’t have an account?</p>
            <a href="/login" className="text-primary ml-2">
              Signup
            </a>
          </div>
        </form>
      </div>

      <img src={rightImage} alt="" className="w-[50vw] hidden lg:block" />
    </div>
  );
};

export default SignIn;
