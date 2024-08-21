import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const location = useLocation(); // Use useLocation to get the current route

  const [selectedItem, setSelectedItem] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const routes = {
    Home: "/",
    Movies: "/movies",
    Schedule: "/schedule",
    Theatres: "/theatres",
  };

  // Update selectedItem based on the current route
  const getSelectedItem = () => {
    const currentPath = location.pathname;
    return Object.keys(routes).find((item) => routes[item] === currentPath) || "Home";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Update selectedItem whenever the route changes
    setSelectedItem(getSelectedItem());
  }, [location]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsMenuOpen(false); // Close menu on selection
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`fixed bg-black left-0 w-full z-50 flex p-4 text-white bg-opacity-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-black bg-opacity-100 h-16 top-0" : "h-16"
      } justify-between items-center`}
    >
      <h1 className="text-2xl font-bold">Movie Mingle</h1>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex flex-grow justify-center items-center `}
      >
        <ul
          className={`flex flex-col md:flex-row md:space-x-24 text-lg md:bg-transparent bg-black md:rounded-none rounded-lg md:p-0 p-4 absolute md:static top-16 right-4 md:right-0 `}
        >
          {["Home", "Movies", "Schedule", "Theatres"].map((item) => (
            <li
              key={item}
              className={`${
                selectedItem === item ? "text-blue-500 font-semibold" : ""
              } hover:text-blue-700 cursor-pointer p-2`}
              onClick={() => handleItemClick(item)}
            >
              <Link to={routes[item]}>{item}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right - Login/Logout Icons */}
      <div className="flex items-center">
        {user?.token ? (
          <div onClick={signOut} className="hover:text-blue-700 cursor-pointer">
            <LogoutIcon />
          </div>
        ) : (
          <Link to="/login" className="hover:text-blue-700 cursor-pointer">
            <LoginIcon />
          </Link>
        )}

        {/* Mobile Menu Icon */}
        <div className="ml-4 md:hidden">
          {isMenuOpen ? (
            <CloseIcon onClick={toggleMenu} className="cursor-pointer" />
          ) : (
            <MenuIcon onClick={toggleMenu} className="cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
