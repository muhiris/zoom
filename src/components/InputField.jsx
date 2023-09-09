import React, { useState } from "react";

function InputField({ label, type, id, placeholder }) {
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
          <input
            type={type}
            id={id}
            className="px-4 py-2 outline-none text-gray-800 border border-gray-300 rounded-lg focus:border-primary"
            placeholder={placeholder}
            onChange={handlePassword}
            required
          />

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
            className="px-4 py-2 outline-none text-gray-800 border border-gray-300 rounded-lg focus:border-primary"
            placeholder={placeholder}
            required
          />
        </>
      )}
    </>
  );
}

export default InputField;
