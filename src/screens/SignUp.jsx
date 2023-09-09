//write basic form react component
import React from "react";
import google from "../assets/google.svg";
import rightImage from "../assets/humanSignin.png";
import section from "../assets/Section.png";
import InputField from "../components/InputField";

import "../index.css";
//functional component
const SignUp = () => {
  return (
    <div className="overflow-hidden h-[100vh] flex items-center justify-center lg:justify-between">
      <div className="flex-start flex-col lg:ml-40">
        <div>
          <h1 className="text-4xl font-medium text-gray-900 mb-4">Sign Up</h1>
        </div>

        <form className="flex flex-col ">
          <InputField
            label={"Name*"}
            type={"text"}
            placeholder={"Enter Name"}
            id={"email"}
          />
          <InputField
            label={"Email*"}
            type={"text"}
            placeholder={"Enter Email"}
            id={"email"}
          />
          <InputField
            label={"Password*"}
            type={"password"}
            placeholder={"Enter Password"}
            id={"password"}
          />

          <input
            type="submit"
            id="button"
            value="Sign In"
            className="mt-6 bg-primary text-white px-4 py-2 rounded-md"
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
            <p>Already have an account?</p>
            <a href="/login" className="text-primary ml-2">
              Log in
            </a>
          </div>
        </form>
      </div>

      <img src={section} alt="" className="w-[50vw] hidden lg:block" />
    </div>
  );
};

export default SignUp;
