import React from "react";
import '../index.css'
import checkCircle from '../assets/check-circle.png'
function Plans() {
  return (
    <div className=" shadow-custom my-6 rounded-lg">
      <div className="p-36">
        <p className="capitalize text-xl">meeting one time plan</p>
        <div  className="flex items-end gap-2">
          <h1 className="font-bold text-5xl">$05</h1>
          <p>one time</p>
        </div>
        <p>Basic features for up to 10 users. </p>
      </div>
      <div className="flex flex-col items-center w-full">

      <button className="my-2 py-4 w-[80%] text-xl text-white bg-primary rounded-lg">Get Started</button>
      <button className="mb-20 py-4 w-[80%] text-xl text-black border-2 border-gray-200 rounded-lg">Chat to Sale</button>
      </div>
    <div className="features px-10 py-16">
        <h1 className="uppercase text-2xl">features</h1>
        <p>Everything in our free plan plus....</p>
    <ul>
        <li className="flex items-center gap-2">
            <img src={checkCircle} alt="" />
            <p>Access to basic features</p>
        </li>
        <li  className="flex items-center gap-2">
            <img src={checkCircle} alt="" />
            <p>Basic reporting and analytics</p>
        </li>
        <li className="flex items-center gap-2">
            <img src={checkCircle} alt="" />
            <p>Up to 10 individual users</p>
        </li>
        <li className="flex items-center gap-2">
            <img src={checkCircle} alt="" />
            <p>20GB individual data each user</p>
        </li>
    </ul>   
    </div>
    </div>
  );
}

export default Plans;
