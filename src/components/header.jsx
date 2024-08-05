import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../img/logo.png";
function Header() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <header className=" bg-customBrown p-4 z-40 items-center fixed top-0 left-0 w-full">
      <nav className="flex justify-between max-w-[80%]  mx-auto items-center">
        <div className="flex gap-14">
          <div className="flex items-center gap-3">
            <div
              className=" md:hidden space-y-1 bg-slate-600 p-1 cursor-pointer"
              onClick={() => setShowMenu(true)}
            >
              <span className=" w-7 h-1 block bg-white"></span>
              <span className=" w-7 h-1 block bg-white"></span>
              <span className=" w-7 h-1 block bg-white"></span>
            </div>
            <img src={Logo} />
          </div>
          <ul
            className={`${
              showMenu
                ? "opacity-100 translate-x-0 visible"
                : "opacity-0 translate-x-full invisible"
            }
          } md:flex absolute top-0 bg-black left-0 w-screen text-white h-screen z-50 flex-col justify-center items-center text-3xl gap-16 md:gap-7 transition-all duration-500 flex md:visible md:opacity-100 md:w-auto md:h-auto md:translate-x-0 md:static md:flex-row md:bg-transparent md:text-sm`}
          >
            <button
              className={`absolute top-10 right-10 text-white md:hidden ${
                showMenu ? "block" : "hidden"
              }`}
              onClick={() => setShowMenu(false)}
            >
              X
            </button>
            <li>
              <Link to="/">الصفحة الرئيسية</Link>
            </li>
            <li>
              <Link to="/workshops">ورشات</Link>
            </li>
            <li>
              <Link to="/products">متجر</Link>
            </li>
            <li>
              <Link to="/articles">مقالات</Link>
            </li>
            <li>
              <Link to="/contactus">اتصل بنا</Link>
            </li>
          </ul>
        </div>
        <Link to="/login">
          <button className="bg-customYellow p-2 text-customBrown">
            تسجيل الدخول
          </button>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
