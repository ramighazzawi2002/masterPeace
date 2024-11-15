import React from "react";
import { FcGoogle } from "react-icons/fc";

const LoginByGoogle = ({ text, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-4
        w-full max-w-md px-6 py-3
        bg-white text-gray-700 font-medium text-sm
        border border-gray-300 rounded-full
        transition-all duration-300 ease-in-out
        hover:bg-gray-50 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <FcGoogle className="text-xl flex-shrink-0" />
      <span>{text}</span>
    </button>
  );
};

export default LoginByGoogle;
