import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imgCall from "../assets/imgCall.png";
function Call() {
  return (
    <>
      <Navbar />
      <img src={imgCall} alt="" className="m-auto my-10" />
      <Footer />
    </>
  );
}

export default Call;
