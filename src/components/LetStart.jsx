import React from "react";

function LetStart() {
  return (
    <div className="my-10 bg-white flex-center">
      <div className="w-full bg-[#D8E0EF] lg:w-[80%] p-20 rounded-xl flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 lg:flex-row">
          <button className="bg-transparent border-2 border-primary text-primary text-xl  rounded-full p-4 hover:bg-primary hover:text-white">
            Get Started
          </button>
          <button className="bg-transparent border-2 border-primary text-primary text-xl  rounded-full p-4 ml-4  hover:bg-primary hover:text-white">
            Plans & Pricing
          </button>
        </div>
        <div className="w-full text-center lg:w-[75%] my-8">
          <h1 className="text-3xl font-medium mb-2 ">
            Let's start your new video conference
          </h1>
          <p className="text-xl">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt
          </p>
        </div>
        <div className="flex flex-col lg:flex-row bg-white p-2 rounded-3xl">
          <input type="text" name="" id="" placeholder="Enter your email address" className="p-6 focus:outline-none"/>
          <button className="bg-primary border-2  text-white text-xl rounded-full p-4">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default LetStart;
