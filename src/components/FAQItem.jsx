import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const FAQItem = ({ question, answer }) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(true);

  const toggleAnswer = () => {
    setIsAnswerVisible(!isAnswerVisible);
  };

  return (
    <div className="relative mx-auto mb-2 ">
      <button
        onClick={toggleAnswer}
        className="border-2 w-[95vw] flex text-xl items-center justify-between gap-20 border-gray-500 text-black py-4 px-4 rounded-md transition-colors duration-300 ease-in-out hover:border-[#141B43]  focus:outline-none lg:w-[90vw]"
      >
        {question}
        <MdOutlineKeyboardArrowDown
          className={`text-xl ${isAnswerVisible ? "transform rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden w-[90vw] transition-max-height duration-300 ${
          isAnswerVisible ? "max-h-0" : "max-h-40"
        }`}
      >
        <div className="py-2 px-4 bg-white rounded-md  shadow-lg">
          <p className="text-black text-xl ">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
