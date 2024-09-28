import { Link } from "react-router-dom";
function HyperLink({ text, link, path }) {
  return (
    <div className="text-right mt-4 pr-9">
      <p>
        {text}{" "}
        <Link className="text-[#6B8E23]" to={path}>
          {link}
        </Link>
      </p>
    </div>
  );
}
export default HyperLink;
