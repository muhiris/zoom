import React from "react";
import '../index.css'
import checkCircle from '../assets/check-circle.png'
import { useSelector } from "react-redux";
import Button from "./Button";
import Button2 from "./Button2";
function Plans({planName,price,info,time,features,handleSubscribe,_id,selected}) {
  const { loading: subscriptionLoading, subscription, error: subscriptionError, success: subscriptionSuccess } = useSelector(state => state.subscription);
  const { loading: stripeLoading, error: stripeError, success: stripeSuccess } = useSelector(state => state.stripe);
  return (
    <div className=" shadow-custom my-6 px-4 py-20 rounded-lg">
      <div className="width-[40vw] flex-center gap-4 flex-col">
        <p className="capitalize text-xl">{planName}</p>
        <div  className="flex items-end gap-2">
          <h1 className="font-bold text-5xl">${price}</h1>
          <p>/{time}</p>
        </div>
        <p>{info} </p>
      </div>
      <div className="flex flex-col items-center w-full">

      <Button onClick={()=>handleSubscribe({_id,price,title:planName,planType:"Plan"})} style={{
        color: "white",
        width: "80%",
        marginTop: "20px",
        borderRadius: "10px",
      }} text="Get Started"
      loading={selected && (subscriptionLoading || stripeLoading)}
      disabled={(subscriptionLoading || stripeLoading)}
       />
      {/* <button className="my-2 py-4 w-[80%] text-xl text-white bg-[#4D87E2] rounded-lg">Get Started</button> */}
      {/* <button className="mb-20 py-4 w-[80%] text-xl text-black border-2 border-gray-200 rounded-lg">Chat to Sale</button> */}
      </div>
    <div className="features px-10 py-16">
        <h1 className="uppercase text-xl">features</h1>
    <ul>
        {
          Object.entries(features).map(([key,value],index)=>
          <li className="flex items-center gap-2 my-3">
              <img src={checkCircle} alt="" />
              <p>{
                key +": "+ value
                }</p>
          </li>
          )
        }
       
    </ul>   
    </div>
    </div>
  );
}

export default Plans;
