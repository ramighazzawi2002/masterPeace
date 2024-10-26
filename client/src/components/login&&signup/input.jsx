import React, { useState } from "react";

const Input = ({ type, name, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== "");
  const handleChange = e => onChange(e.target.value);

  return (
    <div className="relative mb-6">
      <input
        type={type}
        id={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`peer w-full px-4 py-2 text-gray-900 placeholder-transparent border-2 rounded-md focus:outline-none transition-all duration-300
          ${
            error ? "border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
        placeholder={name}
      />
      <label
        htmlFor={name}
        className={`absolute right-2 -top-2.5 bg-white px-1 text-sm transition-all duration-300
          ${
            isFocused || value !== ""
              ? error
                ? "text-red-500 text-sm"
                : "text-blue-500 text-sm"
              : "text-gray-500 text-base top-2"
          }
          peer-placeholder-shown:text-base peer-placeholder-shown:top-2
          peer-focus:-top-2.5 peer-focus:text-sm`}
      >
        {name}
      </label>
      {error && <p className="mt-1 text-xs text-red-500 text-right">{error}</p>}
    </div>
  );
};

export default Input;
