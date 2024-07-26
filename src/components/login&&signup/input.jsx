import { useState } from "react";
function Input({ type, name }) {
  const [label, setLabel] = useState(false);
  return (
    <div className="relative mb-8">
      <label
        for={name}
        className={`text-[#8D8D8D] cursor-text inline-block text-sm font-bold absolute transition-all right-[13%] ${
          label ? "top-[-70%]" : "top-[10%]"
        }`}
      >
        {name}
      </label>
      <input
        type={type}
        id={name}
        className="outline-none  p-1 px-2 border-[1px] inline-block rounded-full border-[#8D8D8D] w-[80%]"
        onInput={e => {
          setLabel(true);
          e.target.value === "" ? setLabel(false) : setLabel(true);
        }}
      />
    </div>
  );
}
export default Input;
