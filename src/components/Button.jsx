import React from "react";

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
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-l-2 border-white"></div>
      </div>
      }
    </button>
  );
}

export default Button;