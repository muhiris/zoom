import React from "react";
import { useNavigate } from "react-router-dom";

import "../index.css";

function HeroSection({ heading, paragraph, btn1, btn2, img,redirect1,redirect2 }) {
  const navigate = useNavigate()

  const handleButtonClick1 = () => {
    navigate(`/${redirect1}`);
  };

  const handleButtonClick2 = () => {
    navigate(`/${redirect2}`);
  };
  return (
    <>
      <div className=" pr-4 overflow-x-hidden flex-between flex-col lg:flex-row">
        <div className=" w-full lg:w-[38%] flex items-center justify-center flex-col ml-4 lg:ml-20 lg:items-start lg:justify-start">
          <h1 className="text-5xl my-12 font-bold space-x-2">{heading}</h1>
          <p className="text-2xl space-x-6 mb-8">{paragraph}</p>
          <div className="flex-between">
            <button onClick={handleButtonClick1} className="text-white px-6 py-4 bg-primary rounded-2xl hover:shadow-secondary shadow-sm transition-all duration-300 ease-in-out">
              {btn1}
            </button>
            <button onClick={handleButtonClick2} className="bg-white text-black border-2 border-[#3f3f3f] ml-6 px-6 py-4  rounded-2xl hover:shadow-secondary shadow-sm transition-all duration-300 ease-in-out">
              {btn2}
            </button>
          </div>
        </div>
        <img src={img} alt="" className=" mt-10" />
      </div>
    </>
  );
}

export default HeroSection;
