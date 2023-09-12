import React from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
function StartTrial() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start justify-between p-20 mb-10 shadow-custom lg:flex-row">
      <div>
        <h1 className="text-3xl mb-2">Start your 30-day free trial</h1>
        <p className="text-xl ">
          Join over 4,000+ startups already growing with Untitled.
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={()=>{navigate("/")}} className="px-4 py-4  text-xl text-white bg-[#4D87E2] rounded-lg">
          Get Started
        </button>
        <button onClick={()=>{navigate("/call")}} className="px-4 py-4  text-xl text-black border-2 border-gray-200 rounded-lg">
          Chat to Sale
        </button>
      </div>
    </div>
  );
}

export default StartTrial;
