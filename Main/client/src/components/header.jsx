import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../img/logo.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/components/context/userData";
import { useCart } from "@/components/context/CartContext";
import profileImage from "../img/profile-circle-icon-512x512-zxne30hp.png";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const { isLoggedIn, setIsLoggedIn, isGoogle } = useUserContext();
  const { cartItemsCount, updateCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const loginResponse = await axios.get(
          "http://localhost:5000/user/is-logged-in"
        );
        setIsLoggedIn(loginResponse.data.isLoggedIn);
        const getProfileResponse = await axios.get(
          `http://localhost:5000/user/profile`
        );
        setProfile(getProfileResponse.data);
        console.log("getProfileResponse: ", getProfileResponse.data);

        // Update cart count
        if (loginResponse.data.isLoggedIn) {
          updateCartCount();
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    })();
  }, [isGoogle, updateCartCount]);

  const navItems = [
    { to: "/", label: "الصفحة الرئيسية" },
    { to: "/workshops", label: "ورشات" },
    { to: "/products", label: "متجر" },
    { to: "/articles", label: "مقالات" },
    { to: "/contactus", label: "اتصل بنا" },
  ];

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      axios.get("http://localhost:5000/user/logout");
      setIsLoggedIn(false);
    }
    navigate("/login");
  };

  return (
    <header className="bg-customBrown font-extrabold p-4 fixed top-0 left-0 w-full z-40">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-white z-50"
            onClick={() => setShowMenu(!showMenu)}
            aria-label={showMenu ? "Close menu" : "Open menu"}
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-14 w-auto rounded-full" />
          </Link>
        </div>
        <ul
          className={cn(
            "fixed inset-0 bg-black/90 flex flex-col justify-center items-center gap-8 text-2xl transition-all duration-300 ease-in-out md:static md:flex-row md:bg-transparent md:text-base z-40",
            showMenu ? "translate-x-0" : "translate-x-full md:translate-x-0",
            "md:flex"
          )}
        >
          {navItems.map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-white hover:text-customYellow transition-colors"
                onClick={() => setShowMenu(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-customYellow"
              >
                <img
                  src={
                    profile?.image
                      ? `${
                          profile.auth_type === "google"
                            ? profile.image
                            : `http://localhost:5000/uploads/${profile.image}`
                        }`
                      : profileImage
                  }
                  className={`h-9 w-9 rounded-full ${
                    !profile?.image && "invert"
                  } true`}
                />
              </Link>
              <Link
                to="/shoppingCart"
                className="text-white hover:text-customYellow relative"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-customYellow text-customBrown rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </>
          )}
          <button
            onClick={handleLoginLogout}
            className={` px-4 py-2 font-bold rounded transition-colors ${
              isLoggedIn
                ? "font-bold bg-red-500 text-white hover:bg-red-600"
                : "bg-customYellow text-customBrown hover:bg-customYellow/80"
            }`}
          >
            {isLoggedIn ? "تسجيل الخروج" : "تسجيل الدخول"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
