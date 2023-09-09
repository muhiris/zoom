import React,{ useState} from 'react'
import hourglass from "../assets/hourglass.png";
import quotient from "../assets/quotient.png";
import commandR from "../assets/command_r.png";
import globalBank from "../assets/globalbank.png";
import nietzsche from "../assets/nitzsche.png";
import catalog from "../assets/catalog.png";
import spherule from "../assets/sphere.png";
import capsule from "../assets/capsule.png";
import acmeCorp from "../assets/acmecorp.png";
import lightBox from "../assets/lightbox.png";
function GridCompaniesName() {
    const [companyName, setCompanyName] = useState([
        "Hourglass",
        "Quotient",
        "Commad+R",
        "GlobalBank",
        "Nietzsche",
        "Catalog",
        "Spherule",
        "Capsule",
        "Acme Corp",
        "Light Box",
      ]);
      const [iconName, setIconName] = useState([
        hourglass,
        quotient,
        commandR,
        globalBank,
        nietzsche,
        catalog,
        spherule,
        capsule,
        acmeCorp,
        lightBox,
      ]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {companyName.map((item, index) => {
      return (
        <div key={index} className=" p-4 flex items-center justify-evenly ">
          <img src={iconName[index]} alt="" />
          <div className="text-[#5C5F5A]">{item}</div>
        </div>
      );
    })}
  </div>
  )
}

export default GridCompaniesName