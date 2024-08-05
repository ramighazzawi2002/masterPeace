import { Link } from "react-router-dom";
function Card({
  cardColor,
  btnColor,
  btnText,
  title,
  description,
  imgSrc,
  alt,
  btnLink,
}) {
  return (
    <div
      className={`text-center rounded-lg shadow w-[80%] mx-auto  p-4 bg-${cardColor}`}
    >
      <img
        src={imgSrc}
        alt={alt}
        className="w-full block mx-auto h-48 rounded-lg"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2 text-customBrown">{title}</h2>
        <p className="text-muted-foreground mb-4 text-customBrown">
          {description}
        </p>
        <Link to={btnLink}>
          <button
            className={`bg-${btnColor} text-lg text-white py-2 px-4 rounded-lg w-[90%]`}
          >
            {btnText}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Card;
