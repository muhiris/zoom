import React from "react";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import logowithtext from "../assets/logowithtext.png";
function Footer() {
  const about = [
    "Zoom Blog",
    "Customers",
    "Our Team",
    "Careers",
    "How to Videos",
  ];
  const support = [
    "Support Center",
    "Live Training",
    "Webinars",
    "System Status",
  ];
  const download = [
    "Zoom Client",
    "Zoom Rooms",
    "Browser Extension",
    "Zoom Mobile Apps",
    "Zoom Plugin",
  ];
  return (
    <div className="bg-[#232333]">
      <ul className="flex justify-around flex-col list-none p-10 text-gray-300 md:flex-row">
        <li className="w-full lg:w-[35%]  flex flex-col gap-10">
          <img src={logowithtext} alt="" className="w-[200px]" />
          <p className="text-xl ">
            What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing
            and typesetting industry Lorem Ipsum has been the industry's.
          </p>
          <div className="flex items-center gap-2 mb-10">
            <FiFacebook className="text-2xl" />
            <FiInstagram className="text-2xl" />
            <FiTwitter className="text-2xl" />
            <FiYoutube className="text-2xl" />
          </div>
        </li>
        <ul>
          <li className="text-2xl text-white mb-4">About</li>
          {about.map((item,index) => {
            return <li key={index} className=" text-xl mb-2">{item}</li>;
          })}
        </ul>
        <ul>
          <li className="text-2xl text-white mb-4">Support</li>
          {support.map((item,index) => {
            return <li key={index} className=" text-xl mb-2">{item}</li>;
          })}
        </ul>
        <ul>
          <li className="text-2xl text-white mb-4">Download</li>
          {download.map((item,index) => {
            return <li key={index} className=" text-xl mb-2">{item}</li>;
          })}
        </ul>
      </ul>
    </div>
  );
}

export default Footer;
