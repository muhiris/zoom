import React from "react";
import Navbar from "../components/Navbar";
import homeHero from "../assets/homeHero.png";
import HeroSection from "../components/HeroSection";
import "../index.css";
import line from "../assets/line.png";
import testimo1 from "../assets/testimo1.png";
import testimo2 from "../assets/testimo2.png";
import testimo3 from "../assets/testimo3.png";
import GridCompaniesName from "../components/GridCompaniesName";
import Testimonial from "../components/Testimonial";
import { AiOutlinePlus,AiOutlineTag } from "react-icons/ai";
import {SlMicrophone,SlSocialDropbox} from "react-icons/sl";
import {TbMoneybag} from "react-icons/tb";
import {PiBankLight} from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {
  SiSemanticscholar,
  SiWorldhealthorganization,
  SiAdobecreativecloud,
  SiShopify,
  SiAirplayvideo
} from "react-icons/si";
import LetStart from "../components/LetStart";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const categories = [
    { icon: <SiSemanticscholar className="text-4xl"/>, text: "Education" },
    { icon: <TbMoneybag className="text-4xl"/>, text: "Financial Service" },
    { icon: <PiBankLight className="text-4xl"/>, text: "Government" },
    { icon: <SiWorldhealthorganization className="text-4xl"/>, text: "Healthcare" },
    { icon: <SlSocialDropbox className="text-4xl"/>, text: "Manufacturing" },
    { icon: <AiOutlineTag className="text-4xl"/>, text: "Retail" },
  ];
  const systemFunctions = [
    {
      icon: <SiAirplayvideo />,
      text: "HD Video Calling",
      p: "HD is a must to enhance immersion and boost employee engagement. They expect to",
    },
    {
      icon: <SiAdobecreativecloud />,
      text: "Screen Sharing",
      p: "HD is a must to enhance immersion and boost employee engagement. They expect to",
    },
    {
      icon: <SlMicrophone />,
      text: "Recording",
      p: "HD is a must to enhance immersion and boost employee engagement. They expect to",
    },
  ];
  return (
    <div className="overflow-x-hidden ">
      <Navbar />
      <HeroSection
        heading={"One Platform To Collaborate"}
        paragraph={
          "Qonnect helps consolidate communications, connect people, and collaborate better together in the boardroom, classroom, operating room, and everywhere in between."
        }
        btn1={"Create Meeting"}
        btn2={"Enter Code"}
        redirect1={"call"}
        redirect2={"call"}
        img={homeHero}
      />
      <div className="flex-center w-full">
        <h2 className="text-black text-center text-3xl my-20 w-[80%]">
          More than <span className="text-primary">14 million</span> people
          across 200,000 companies choose qonnect.
        </h2>
      </div>
      <GridCompaniesName />
      <div className="text-center w-100 my-20">
        <h1 className=" font-medium text-4xl mb-4 ">How zoom works.</h1>
        <p className="text-xl">
          Connect people, and collaborate better together everywhere in between.
        </p>
      </div>
      <div className=" pr-4 relative">
        <img
          src={line}
          alt=""
          className="hidden lg:block absolute left-[45%]"
        />
        <Testimonial
          img={testimo2}
          h={"Create room and collaborate with your team"}
          p={
            "Simply paste a link to your video wherever your recipients are and they can watch it without logging in or creating an account."
          }
        />
        <Testimonial
          img={testimo1}
          h={"Record your screen and camera at the same time"}
          p={
            "Start recording your screen and camera easily. Works on any device using Qonnect desktop and mobile apps or Chrome extension."
          }
          reverse={false}
        />
        <Testimonial
          img={testimo3}
          h={"Keep the conversation going without delay"}
          p={
            "Use emoji reactions, time-stamped comments, and interactive features to respond to videos and keep your team connected."
          }
        />
      </div>
      <h1 className=" font-medium text-4xl my-40 m-auto w-[70%]">
        One central place for easy collaboration, a seamless workflow, and
        visibility across all users and flows.
      </h1>
      <div className="container m-auto flex flex-col justify-between lg:flex-row">
        <div className="left w-full ml-6 mb-6 lg:w-[50%] ">
          <h1 className=" font-medium text-4xl mb-10">
            Powering organizations across industries and geographies{" "}
          </h1>
          <p className="text-xl mb-4">
            Zoom helps consolidate communications, connect people, and
            collaborate better together in the boardroom, classroom, operating
            room, and everywhere in between.
          </p>
          <button onClick={()=>{navigate("plans")}} className="flex-between gap-2 bg-primary text-white border-2 px-4 py-3 lg:m-2 rounded-2xl">
            <AiOutlinePlus />
            <p className="text-xl">Explore Industry Solutions</p>
          </button>
        </div>
        <div className="right w-full grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center lg:w-[40%]">
          {categories.map((category, index) => (
            <div
              key={index}
              className="w-[250px] h-[150px]  text-2xl border-2 flex flex-col items-center justify-center border-gray-200 rounded-xl"
            >
              {category.icon}
              <h1 className="text-2xl mt-2">{category.text}</h1>
            </div>
          ))}
        </div>
      </div>
      <h1 className="font-medium text-4xl my-40 m-auto text-center w-full">
        Zoom Conference System Features{" "}
      </h1>

      <div className="pr-4 flex flex-col items-center  justify-center lg:flex-row">
        {systemFunctions.map((item, index) => (
          <div
            key={index}
            className="p-6 ml-4 mb-4 gap-4 cursor-pointer text-3xl border-2 flex flex-col items-center justify-between border-gray-200 rounded-xl hover:bg-primary hover:text-white hover:shadow-md"
          >
            {item.icon}
            <h1 className="text-2xl font-medium">{item.text}</h1>
            <p className="text-xl text-center">{item.p} </p>
          </div>
        ))}
      </div>
      <LetStart />
      <Footer />
    </div>
  );
}

export default Home;
