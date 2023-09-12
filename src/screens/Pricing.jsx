import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";
import Plans from "../components/Plans";
import FAQ from "../components/FAQ";
import avatar from "../assets/avatar.png";
import StartTrial from "../components/StartTrial";
function Pricing() {
  return (
    <>
      <Navbar />
      <div>
        <p className="text-xl text-primary text-center">Pricing</p>
        <h1 className="text-3xl text-center">Simple, transparent pricing</h1>
        <p className="text-xl text-center">
          We believe Untitled should be accessible to all companies, no matter
          the size.
        </p>
      </div>
      <div className="flex mb-6 mt-10 flex-center ">
        <div className="bg-[#F9FAFB] py-3 rounded-lg w-[70%] lg:w-[50%] flex-center gap-4">
          <button className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Monthly Billing
          </button>
          <button className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
           Annual Billing
          </button>
          <button className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Choose Custom Plan
          </button>
        </div>
      </div>
      <div className="grid gap-4 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Plans planName={"meeting one time plan"} price={"$5"} info={"Basic features for up to 10 users."} time={"one time"}  />
        <Plans planName={"meeting enterprise plan"} price={"$20"} info={"Growing teams up to 20 users."} time={"per month"}  />
        <Plans planName={"meeting enterprise plan"} price={"$20"} info={"Growing teams up to 20 users."} time={"per month"}  />
        <Plans planName={"meeting Premium plan"} price={"$40"} info={"Advanced features + unlimited users."} time={"per year"}  />
        
      </div>
      {/* Next Section */}

      <h1 className="text-3xl font-medium text-center mt-24 mb-6">
        Frequently Asked Questions</h1>
        <p className="text-xl text-center mb-20">Everything you need to know about the product and billing.</p>
<FAQ/>
        {/* Next section */}
        <div className="flex gap-4 flex-col items-center justify-center">
          <img src={avatar} alt="" />
          <h1 className="text-2xl font-medium">Still Have Questions?</h1>
          <p className="text-xl mb-4">Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
          <button className="mb-10 p-4 text-xl text-white bg-[#4D87E2] rounded-lg">Get in touch</button>
        </div>
        {/* Next Section */}
        <StartTrial />
      <Footer />
    </>
  );
}

export default Pricing;
