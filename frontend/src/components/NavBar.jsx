import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { axiosPrivate } from "../api/axios";

const NavBar = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/users/getUser");
        setUserDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (user?.token) {
      fetchData();
    } else {
      setUserDetails({});
    }
  }, [user?.token]);

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

  const getSelectedItem = () => {
    const currentPath = location.pathname;
    return (
      Object.keys(routes).find((item) => routes[item] === currentPath) || "Home"
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setSelectedItem(getSelectedItem());
  }, [location]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsMenuOpen(false);
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
        } md:flex flex-grow justify-center items-center`}
      >
        <ul
          className={`flex flex-col md:flex-row md:space-x-24 text-lg md:bg-transparent bg-black md:rounded-none rounded-lg md:p-0 p-4 absolute md:static top-16 right-4 md:right-0`}
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

      <div className="flex items-center">
        {user?.token ? (
          <div className="flex flex-row gap-3">
            <img
              src={userDetails.avatar}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
            <LogoutIcon
              className="hover:text-blue-700 cursor-pointer"
              onClick={signOut}
            />
          </div>
        ) : (
          <Link to="/login" className="hover:text-blue-700 cursor-pointer">
            <LoginIcon />
          </Link>
        )}

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
