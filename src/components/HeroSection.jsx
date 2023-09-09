import React from "react";
import "../index.css";

function HeroSection({ heading, paragraph, btn1, btn2, img }) {
  return (
    <>
      <div className="overflow-x-hidden flex-between flex-col lg:flex-row">
        <div className=" flex items-center justify-center flex-col ml-4 lg:ml-20 lg:items-start lg:justify-start">
          <h1 className="text-5xl my-12 font-bold space-x-2">{heading}</h1>
          <p className="text-2xl space-x-6 mb-8">{paragraph}</p>
          <div className="flex-between">
            <button className="text-white px-6 py-4 bg-primary rounded-2xl hover:shadow-secondary shadow-sm transition-all duration-300 ease-in-out">
              {btn1}
            </button>
            <button className="bg-white text-black border-2 border-[#3f3f3f] ml-6 px-6 py-3  rounded-2xl hover:shadow-secondary shadow-sm transition-all duration-300 ease-in-out">
              {btn2}
            </button>
          </div>
        </div>
        <img src={img} alt="" className="w-full lg:w-[50vw] mt-10" />
      </div>
    </>
  );
}

export default HeroSection;
