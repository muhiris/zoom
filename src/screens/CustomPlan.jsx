import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import StartTrial from "../components/StartTrial";
import avatar from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";
function CustomPlan() {
    const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div>
        <p className="text-xl text-primary text-center">Pricing</p>
        <h1 className="text-3xl text-center">
          Compare our plans and find yours
        </h1>
        <p className="text-xl text-center">
          Simple, transparent pricing that grows with you. Try any plan free for
          30 days.
        </p>
      </div>
      <div className="flex mb-6 mt-10 flex-center ">
        <div className="bg-[#F9FAFB] py-3 rounded-lg w-full lg:w-[50%] flex-center gap-4">
          <button onClick={()=>{navigate("/plans")}} className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Monthly Billing
          </button>
          <button onClick={()=>{navigate("/plans")}} className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Annual Billing
          </button>
          <button onClick={()=>{navigate("/custom")}} className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Choose Custom Plan
          </button>
        </div>
      </div>
      <div className=" shadow-custom my-6 px-4 py-20 rounded-lg">
        <div className="width-[40vw] flex-center gap-4 flex-col">
          <p className="capitalize text-xl">Custom Plan</p>
          <div className="flex items-end gap-2">
            <h1 className="font-bold text-5xl">$10/cus</h1>
          </div>
          <p>Our most popular plan. </p>
        </div>
        <div className="flex flex-col items-center w-full">
          <button className="my-2 py-4 w-[80%] text-xl text-white bg-[#4D87E2] rounded-lg">
            Get Started
          </button>
          <button className="mb-20 py-4 w-[80%] text-xl text-black border-2 border-gray-200 rounded-lg">
            Chat to Sale
          </button>
        </div>
        <div className="features px-10 py-16">
          <h1 className="uppercase text-3xl">features</h1>
          <ul className="mt-4 flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox border-2 border-primary text-blue-500 h-6 w-6 p-1"
                id="feature1"
              />
              <label htmlFor="feature1" className="ml-2 text-2xl">
                Access to basic features
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-6 w-6 p-1"
                id="feature2"
              />
              <label htmlFor="feature2" className="ml-2 text-2xl">
                Basic reporting and analytics
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-6 w-6 p-1"
                id="feature3"
              />
              <label htmlFor="feature3" className="ml-2 text-2xl">
                Up to 10 individual users
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-6 w-6 p-1"
                id="feature4"
              />
              <label htmlFor="feature4" className="ml-2 text-2xl">
                20GB individual data
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox border-2 border-primary text-blue-500 h-6 w-6 p-1"
                id="feature1"
              />
              <label htmlFor="feature1" className="ml-2 text-2xl">
                Access to basic features
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-6 w-6 p-1"
                id="feature2"
              />
              <label htmlFor="feature2" className="ml-2 text-2xl">
                Basic reporting and analytics
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-6 w-6 p-1"
                id="feature3"
              />
              <label htmlFor="feature3" className="ml-2 text-2xl">
                Up to 10 individual users
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-6 w-6 p-1"
                id="feature4"
              />
              <label htmlFor="feature4" className="ml-2 text-2xl">
                20GB individual data
              </label>
            </li>

          </ul>
        </div>
      </div>
      <FAQ />
      {/* Next section */}
      <div className="flex gap-4 flex-col items-center justify-center">
        <img src={avatar} alt="" />
        <h1 className="text-2xl font-medium">Still Have Questions?</h1>
        <p className="text-xl mb-4 text-center">
          Can’t find the answer you’re looking for? Please chat to our friendly
          team.
        </p>
        <button onClick={()=>{navigate("/")}} className="mb-10 p-4 text-xl text-white bg-[#4D87E2] rounded-lg">
          Get in touch
        </button>
      </div>
      {/* Next Section */}
      <StartTrial />
      <Footer />
    </div>
  );
}

export default CustomPlan;
