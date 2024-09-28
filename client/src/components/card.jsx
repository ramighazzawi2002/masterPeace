import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Card = ({
  cardColor = "white",
  btnColor = "blue",
  btnText,
  title,
  description,
  imgSrc,
  alt,
  btnLink,
  className,
}) => {
  return (
    <div
      className={cn(
        "text-center rounded-lg shadow-md w-full max-w-sm mx-auto overflow-hidden",
        `bg-${cardColor}`,
        className
      )}
    >
      <img src={imgSrc} alt={alt} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={btnLink}
          className={cn(
            "inline-block w-full py-2 px-4 rounded-lg text-white text-lg font-medium transition-colors duration-200",
            `bg-${btnColor} hover:bg-${btnColor}/80`
          )}
        >
          {btnText}
        </Link>
      </div>
    </div>
  );
};

export default Card;
