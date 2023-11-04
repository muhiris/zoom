import React from "react";
import Loading from "./Loading";

function Button({disabled=false,...props}) {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <button
      type={props.type || "button"}
      onClick={handleClick}
      style={props.style}
      disabled={props.loading || disabled}
      className={props.className || "flex justify-center items-center bg-primary text-white px-4 py-2 rounded-md cursor-pointer"}
    >
      {!props.loading ? props.text : 
      <Loading color={props.loaderColor || "#fff"} />
      }
    </button>
  );
}

export default Button;