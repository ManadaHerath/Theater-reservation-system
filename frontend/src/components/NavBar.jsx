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
      className={`fixed text-white left-0 top-0 w-full pr-5 z-50 flex ${
        isScrolled
          ? "bg-black bg-opacity-100 h-12"
          : "bg-black bg-opacity-0 "
      } transition-all duration-500 ease-in-out justify-between items-center`}
    >
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex flex-grow justify-center items-center relative inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.8)]  to-transparent`}
      >
        <ul
          className={`flex text-white flex-col md:flex-row md:space-x-24 text-lg md:bg-transparent bg-black md:rounded-none rounded-lg md:p-0 p-4 absolute md:static top-16 right-4 md:right-0 ${
            isScrolled ? "bg-black bg-opacity-100" : "bg-black bg-opacity-0"
          } transition-colors duration-500 ease-in-out`}
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
              className="w-10 h-10 rounded-full"
            />
            <button className=" cursor-pointer" onClick={signOut}>
              <div className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-900">
                {" "}
                Logout
              </div>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="cursor-pointer bg-blue-800 hover:bg-blue-900 rounded-xl"
          >
            <div className="flex flex-row gap-3 text-white px-4 py-2 rounded-xl ">
              Login
            </div>
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
