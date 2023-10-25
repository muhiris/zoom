import React from "react";

function Testimonial({ img, p, h, reverse=true,show=false }) {
  return (
    <>
      {reverse ? (
        <div className=" px-6 relative flex flex-col mt-5 items-center justify-between lg:flex-row">
        <div className="bg-transparent absolute top-20 left-6 w-[35px] h-[35px] rounded-3xl lg:bg-slate-200"> </div>
          <div className="w-100 my-10 ml-4 lg:w-[35%] lg:ml-16 ">
            <h2 className="text-3xl font-medium ">{h}</h2>
            <p className="text-xl mt-5">{p}</p>
          </div>
          <img src={img} alt="" />
        </div>
     
      ) : (
        <div className=" px-6 flex flex-col-reverse  items-center justify-between lg:flex-row">
          <img src={img} alt="" />
          <div className="w-100 my-10 ml-4 lg:w-[35%] lg:ml-16 ">
            <h2 className="text-3xl font-medium ">{h}</h2>
            <p className="text-xl mt-5">{p}</p>
          </div>
        </div>
      )}
       </>
    // check reverse is true or false and show appropriate div
  );
}

export default Testimonial;
