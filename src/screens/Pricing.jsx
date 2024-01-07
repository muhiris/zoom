import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";
import Plans from "../components/Plans";
import FAQ from "../components/FAQ";
import avatar from "../assets/avatar.png";
import StartTrial from "../components/StartTrial";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toast";
import { createSubscription } from "react-redux/es/utils/Subscription";
import { createPaymentIntent } from "../redux/slice/stripe/stripeAction";
import { useStripe } from "@stripe/react-stripe-js";
function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: plansLoading, plans, error: plansError, success: plansSuccess } = useSelector(state => state.plan);
  const { loading: stripeLoading, error: stripeError, success: stripeSuccess } = useSelector(state => state.stripe);
  const { userInfo } = useSelector(state => state.user);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = (plan) => {
    if(!userInfo?._id){
      navigate("/login");
      return;
    }
    setSelectedPlan(plan._id);
    dispatch(createPaymentIntent({ planId: plan?._id })).then((res) => {
      if (createPaymentIntent.fulfilled.match(res)) {
        const { paymentIntent, ephemeralKey, customerId } = res.payload.data;
        navigate("/payment", { state: { plan: plan, clientSecret: paymentIntent, customer: customerId, ephemeralKey: ephemeralKey } });
      }else{
        setSelectedPlan(null);
      }
    });
    
  }

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
        <div className="bg-[#F9FAFB] py-3 rounded-lg w-full lg:w-[50%] flex-center gap-4">
          <button onClick={() => { navigate("/plans") }} className="text-xl  p-3 shadow-md bg-white text-black rounded-lg transition-all ease-in-out">
            Plans
          </button>
          <button onClick={() => { navigate("/custom") }} className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Custom Plan
          </button>
        </div>
      </div>
      <div className="grid gap-4 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {
          plans?.map((plan) => (
            <Plans
              key={plan._id}
              planName={plan.title}
              price={plan.price}
              info={plan.description}
              time={`${plan.duration} ${plan.durationType}`}
              handleSubscribe={handleSubscribe}
              features={plan.features}
              plan={plan}
              _id={plan._id}
              selected={selectedPlan === plan._id}
            />
          ))
        }
      </div>
      {/* Next Section */}


      <FAQ />
      {/* Next section */}
      <div className="flex gap-4 flex-col items-center justify-center">
        <img src={avatar} alt="" />
        <h1 className="text-2xl font-medium">Still Have Questions?</h1>
        <p className="text-xl mb-4 text-center">
          Can’t find the answer you’re looking for? Please chat to our friendly
          team.
        </p>
        <button onClick={() => { navigate("/") }} className="mb-10 p-4 text-xl text-white bg-[#4D87E2] rounded-lg">
          Get in touch
        </button>
      </div>
      {/* Next Section */}
      <StartTrial />
      <Footer />
    </>
  );
}

export default Pricing;
