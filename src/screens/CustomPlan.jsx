import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import StartTrial from "../components/StartTrial";
import avatar from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { createCustomPlan } from "../redux/slice/customPlan/customPlanAction";
import { toast } from "react-toast";
import { createPaymentIntent } from "../redux/slice/stripe/stripeAction";
function CustomPlan() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: featuresLoading, features, error: featuresError, success: featuresSuccess } = useSelector(state => state.feature);
  const { loading: customPlanLoading, customPlan, error: customPlanError, success: customPlanSuccess } = useSelector(state => state.customPlan);
  const { loading: stripeLoading, error: stripeError, success: stripeSuccess } = useSelector(state => state.stripe);
  const [selectedFeatures, setSelectedFeatures] = useState([]);



  const handleCreatePlan = () => {

    console.log(selectedFeatures);

    if (selectedFeatures.length === 0) {
      toast.error("Please select atleast one feature");
      return;
    }
    else if (!selectedFeatures["meetingDuration"]) {
      toast.error("Meeting Duration is a required field");
      return;
    }

    else if (!selectedFeatures["participant"]) {
      toast.error("Atleast one participant is required");
      return;
    }

    let featuresData = {};
    if (selectedFeatures["meetingDuration"]) {
      featuresData.maxDuration = selectedFeatures["meetingDuration"];
      featuresData.durationType = "hours";
    }
    if (selectedFeatures["participant"]) {
      featuresData.maxParticipants = selectedFeatures["participant"];
    }
    if (selectedFeatures["recording"]) {
      featuresData.recording = selectedFeatures["recording"];
    }

    let price = features.reduce((acc, feature) => {
      if (feature.title === "recording") {
        return acc + (selectedFeatures[feature.title] ? feature.price : 0)
      }
      return acc + (selectedFeatures[feature.title] * feature.price || 0)
    }, 0)



    let data = {
      features: featuresData,
      price: price,
      durationType: "month",
      duration: 1,
    }

    dispatch(createCustomPlan(data)).then((res) => {
      if (createCustomPlan.fulfilled.match(res)) {
        console.log(res.payload.data,"res");
        dispatch(createPaymentIntent({ planId: res.payload.data._id, planType: "CustomPlan" })).then((res2) => {
          if (createPaymentIntent.fulfilled.match(res2)) {
            const { paymentIntent, ephemeralKey, customerId } = res2.payload.data;
            navigate("/payment", { state: { plan: {
              _id:res.payload.data._id,
              price:res.payload.data.price,
              planType:"CustomPlan"
            }, clientSecret: paymentIntent, customer: customerId, ephemeralKey: ephemeralKey } });
          }
        });
      }
    })
  }



  return (
    <div>
      <Navbar />
      <div>
        <p className="text-xl text-primary text-center">Pricing</p>
        <h1 className="text-3xl text-center">
          Compare our plans and find yours
        </h1>
        <p className="text-xl text-center">
          Simple, transparent pricing that grows with you. Try any plan free for
          30 days.
        </p>
      </div>
      <div className="flex mb-6 mt-10 flex-center ">
        <div className="bg-[#F9FAFB] py-3 rounded-lg w-full lg:w-[50%] flex-center gap-4">

          <button onClick={() => { navigate("/plans") }} className="text-xl text-[#667085] p-3 hover:shadow-md hover:bg-white hover:text-black rounded-lg transition-all ease-in-out">
            Plans
          </button>
          <button onClick={() => { navigate("/custom") }} className="text-xl  p-3 shadow-md bg-white text-black rounded-lg transition-all ease-in-out">
            Custom Plan
          </button>
        </div>
      </div>
      <div className=" shadow-custom my-6 px-4 py-20 rounded-lg">
        <div className="width-[40vw] flex-center gap-4 flex-col">
          <p className="capitalize text-xl">Custom Plan</p>
          <div className="flex items-end gap-2">
            <h1 className="font-bold text-5xl">${
              features.reduce((acc, feature) => {
                if (feature.title === "recording") {
                  return acc + (selectedFeatures[feature.title] ? feature.price : 0)
                }
                return acc + (selectedFeatures[feature.title] * feature.price || 0)
              }, 0)
            }/month</h1>
          </div>
          {/* <p>Our most popular plan. </p> */}
        </div>
        <div className="flex flex-col items-center w-full">
          <Button loading={customPlanLoading || stripeLoading} text={"Get Started"} style={{ flex: 1, width: "80%", padding: 15, marginTop: 20 }} onClick={handleCreatePlan} />
          {/* <button className="mb-20 py-4 w-[80%] text-xl text-black border-2 border-gray-200 rounded-lg">
            Chat to Sale
          </button> */}
        </div>
        <div className="features px-10 py-16">
          <h1 className="uppercase text-3xl">features</h1>
          <table className="table-fixed w-full mt-10">
            <thead>
              <tr>
                <th className="w-1/2 text-left">Features</th>
                <th className="w-1/4 text-left">Qunatity</th>
                <th className="w-1/4 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {
                features.map((feature, index) =>
                  <tr>
                    <td className="border-2 border-gray-200 p-4">
                      <div>
                        <p>{feature.title}</p>
                        <p className="text-sm font-light">{feature.description}</p>
                      </div>
                    </td>
                    <td className="border-2 border-gray-200 p-4">{
                      feature.title === "recording" ?
                        <input
                          type="checkbox"
                          className="form-checkbox border-2 border-primary text-blue-500 h-6 w-6 p-1"
                          id="feature1"
                          onChange={(e) => {

                            if (!e.target.checked) {
                              let temp = { ...selectedFeatures };
                              delete temp[feature.title];
                              setSelectedFeatures(temp);
                              return;
                            }
                            setSelectedFeatures({ ...selectedFeatures, [feature.title]: e.target.checked })
                          }}
                        /> :
                        <input
                          type="number"
                          value={selectedFeatures[feature.title]}
                          onChange={(e) => {

                            if (e.target.value === "" || e.target.value === "0") {
                              let temp = { ...selectedFeatures };
                              delete temp[feature.title];
                              setSelectedFeatures(temp);
                              return;
                            }
                            setSelectedFeatures({ ...selectedFeatures, [feature.title]: e.target.value })
                          }}
                          className="border-2 border-gray-200 p-2 flex-1 max-w-full"
                          min={0}
                          defaultValue={0}

                        />
                    }</td>
                    <td className="border-2 border-gray-200 p-4">${
                      feature.title === "recording" ?
                        selectedFeatures[feature.title] ? feature.price : 0
                        :
                        selectedFeatures[feature.title] * feature.price || 0
                    }</td>
                  </tr>
                )
              }
            </tbody>
          </table>

        </div>
      </div>
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
    </div>
  );
}

export default CustomPlan;
