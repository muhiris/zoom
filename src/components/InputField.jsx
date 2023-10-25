import React, { useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
function InputField({ label, type, id, placeholder, name }) {
  let labelHTML = label.toLowerCase();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 7) {
      setPasswordError("");
    } else {
      setPasswordError("Password must be at least 8 characters.");
    }
  };
  return (
    <>
      {type === "password" ? (
        <>
          <label htmlFor={labelHTML} className="py-2">
            {label}
          </label>
          <div className="flex items-center text-gray-800 border border-gray-300 rounded-lg focus:border-primary bg-white focus:bg-slate-200  ">
            <input
              type={type}
              name={name}
              id={id}
              className="px-4 lg:pl-4 lg:pr-24 py-2 outline-none border-gray-300 rounded-lg flex-1 "
              placeholder={placeholder}
              onChange={handlePassword}
              required
            />
            <AiOutlineEyeInvisible className="text-2xl mr-2" />
          </div>

          <p className="text-red-500">{passwordError}</p>
        </>
      ) : (
        <>
          <label htmlFor={labelHTML} className="py-2">
            {label}
          </label>
          <input
            type={type}
            id={id}
            className="px-4 lg:pl-4 lg:pr-24 py-2 outline-none text-gray-800 border border-gray-300 rounded-lg focus:border-primary"
            placeholder={placeholder}
            required
          />
        </>
      )}
    </>
  );
}

export default InputField;
