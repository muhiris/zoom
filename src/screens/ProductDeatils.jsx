import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import groupcall from "../assets/groupcall.png";
import groupcall1 from "../assets/groupcall1.png";
import groupcall2 from "../assets/groupcall2.png";
import calling from "../assets/calling.png";
import Testimonial from "../components/Testimonial";
import { FiMonitor } from "react-icons/fi";
import { RiWirelessChargingFill } from "react-icons/ri";
import { BsTelephoneForward } from "react-icons/bs";
import { MdOutlineTouchApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Plans from "../components/Plans";
function ProductDeatils() {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {/* Next Section */}
      <HeroSection
        heading={"Bring meeting spaces online"}
        paragraph={
          "Conference rooms that make it easy to run or join video meetings with a tap of a button"
        }
        btn1={"Talk to an expert"}
        btn2={"Plans & Pricing"}
        img={groupcall}
        redirect2={"plans"}
        redirect1={"call"}
      />
      {/* Next Section */}
      <div className="my-40 flex flex-col gap-y-32">
        <Testimonial
          img={groupcall1}
          h={"What are Zoom Rooms?"}
          p={
            "The modern workspaces for hybrid teams, Zoom Rooms bring HD video collaboration into any space – in the office, in the classroom, or at home – and enable in-person and remote participants to interact in real time. Simple to start a meeting, book a room, and share content, Zoom Rooms are the conference room experience you’ve always wanted."
          }
          reverse={false}
        />
        <Testimonial
          img={groupcall2}
          h={"Zoom Rooms in Action"}
          p={
            "See how the teams at F5 Networks are using Zoom Rooms to interact with customers in innovative ways.See how the teams at F5 Networks are using Zoom Rooms to interact with customers in innovative ways. See how the teams at F5 Networks are using Zoom Rooms to interact with customers in innovative ways."
          }
        />
      </div>
      {/* Next Section */}
      <div className="bg-gradient-to-r from-[#00031F] via-[#00031F] to-[#0B5CFF] flex flex-col w-full items-center justify-between lg:flex-row ">
        <div className="p-14  bg-[#00031F] text-white">
          <h1 className="text-3xl my-2">Zoom Rooms Features</h1>
          <ul className="text-xl list-none flex flex-col">
            <li>Workspace Reservation</li>
            <li>Smart Gallery</li>
            <li>Kiosk Mode Virtual Receptionist</li>
            <li>Control Zoom Rooms from your mobile device or laptop</li>
            <li>Scheduling Display with People Counting</li>
            <li>Enhanced Voice Commands for Zoom Rooms</li>
            <li>Digital Signage, Included</li>
          </ul>
          <button className="bg-primary rounded-full text-xl p-4 text-white my-6">
            Intelligent Director
          </button>
        </div>
        <div className="bg-[#0B5CFF] p-14  ">
          <img src={calling} alt="" />
        </div>
      </div>
      {/* Next Section */}
      <div>
        <h1 className="text-3xl font-medium text-center my-24">
          Zoom Core Features
        </h1>
        <div className="container mb-32 grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4">
          <div className="box flex w-[80%] gap-8">
            <FiMonitor className="text-5xl" />
            <div>
              <h2 className="text-2xl">HD Video and Audio</h2>
              <p className="text-xl">
                Flawless, high-definition video across desktop, mobile, and room
                systems
              </p>
            </div>
          </div>
          <div className="box flex w-[80%] gap-8">
            <RiWirelessChargingFill className="text-7xl" />
            <div>
              <h2 className="text-2xl">Wireless sharing</h2>
              <p className="text-xl">
                Share content from your laptop or mobile device easily with just
                one touch
              </p>
            </div>
          </div>
          <div className="box flex w-[80%] gap-8">
            <BsTelephoneForward className="text-5xl" />
            <div>
              <h2 className="text-2xl">Interoperability</h2>
              <p className="text-xl">
                Support for standards based SIP/H.323 hardware endpoints
              </p>
            </div>
          </div>
          <div className="box flex w-[80%] gap-8">
            <MdOutlineTouchApp className="text-7xl" />
            <div>
              <h2 className="text-2xl">One touch to join</h2>
              <p className="text-xl">
                Quickly join scheduled meetings with one touch on a wide range
                of hardware from leading vendors
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Next Section */}
      <h1 className="text-3xl font-medium text-center my-24">
        Get Started With Zoom Rooms Plans
      </h1>
      <div className="flex items-center justify-around flex-wrap">
      <Plans planName={"meeting one time plan"} price={"$5"} info={"Basic features for up to 10 users."} time={"one time"}  />
      <Plans planName={"meeting enterprise plan"} price={"$20"} info={"Growing teams up to 20 users."} time={"per month"}  />
          
      </div>
      {/* Next Section */}
      <Testimonial show={true} img={groupcall1} h={"Interested in providing premium home office setups?"} p={"Leverage Zoom Meeting licenses (free or paid) and Zoom for Home devices to deploy a conference room experience at home."} />
     {/* Next Section */}
     <div className="my-20 bg-white flex-center">
      <div className="w-full bg-[#D8E0EF] lg:w-[80%] px-2 py-20 rounded-xl flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 w-[80%]">
          <h1 className="text-3xl font-medium text-center">Contact Us</h1>
          <p className="text-xl text-center">Have questions about Zoom Rooms or Spaces? Interested in a demo or free trial? Feel free to contact our sales team by filling out and submitting this form.</p>
          <button onClick={()=>{navigate("/custom")}} className="capitalize text-white bg-primary rounded-full w-[300px] text-xl p-4 ">contact our sales team</button>
          </div>
          </div>
          </div>
      <Footer />
    </div>
  );
}

export default ProductDeatils;
