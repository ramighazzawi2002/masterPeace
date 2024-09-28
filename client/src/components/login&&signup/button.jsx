import React from "react";

const Button = ({ text, onClick, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-white text-sm font-medium rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40]"
        }
      `}
    >
      {text}
    </button>
  );
};

export default Button;
