import React from "react";
import '../index.css'
import checkCircle from '../assets/check-circle.png'
function Plans({planName,price,info,time}) {
  return (
    <div className=" shadow-custom my-6 px-4 py-20 rounded-lg">
      <div className="width-[40vw] flex-center gap-4 flex-col">
        <p className="capitalize text-xl">{planName}</p>
        <div  className="flex items-end gap-2">
          <h1 className="font-bold text-5xl">{price}</h1>
          <p>{time}</p>
        </div>
        <p>{info} </p>
      </div>
      <div className="flex flex-col items-center w-full">

      <button className="my-2 py-4 w-[80%] text-xl text-white bg-[#4D87E2] rounded-lg">Get Started</button>
      <button className="mb-20 py-4 w-[80%] text-xl text-black border-2 border-gray-200 rounded-lg">Chat to Sale</button>
      </div>
    <div className="features px-10 py-16">
        <h1 className="uppercase text-xl">features</h1>
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
