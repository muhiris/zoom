import React from "react";
import { useNavigate } from "react-router-dom";

import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { createMeet } from "../redux/slice/meet/meetAction";
import Button from "./Button";

function HeroSection({ heading, paragraph, btn1, btn2, img,redirect1,redirect2 }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const {loading:meetLoading}= useSelector(state=>state.meet);
  const {userInfo} = useSelector(state=>state.user);

  const handleButtonClick1 = () => {
    dispatch(createMeet({})).then((res)=>{
      if(createMeet.fulfilled.match(res)){
        console.log(res);
          navigate('/call', {state : { video:true,audio:true,meetId:res.payload.data._id,name:userInfo.name}})
      }
  })
  };

  const handleButtonClick2 = () => {
    navigate(`/${redirect2}`);
  };
  return (
    <>
      <div className=" pr-4 overflow-x-hidden flex-between flex-col lg:flex-row">
        <div className=" w-full lg:w-[38%] flex items-start justify-center flex-col ml-4 lg:ml-20 lg:items-start lg:justify-start">
          <h1 className="text-5xl my-12 font-bold space-x-2">{heading}</h1>
          <p className="text-2xl space-x-6 mb-8">{paragraph}</p>
          <div className="flex-between">
            <Button loading={meetLoading} text={btn1} onClick={handleButtonClick1} className="text-white px-6 py-4 mr-4 bg-primary rounded-2xl hover:shadow-secondary shadow-sm transition-all duration-300 ease-in-out" />
            <Button disabled={meetLoading} text={btn2} onClick={handleButtonClick2} className="text-white px-6 py-4 bg-primary rounded-2xl hover:shadow-secondary shadow-sm transition-all duration-300 ease-in-out" />

            
          </div>
        </div>
        <img src={img} alt="" className=" mt-10" />
      </div>
    </>
  );
}

export default HeroSection;
