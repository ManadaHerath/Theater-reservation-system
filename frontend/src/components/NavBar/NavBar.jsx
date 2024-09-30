import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { axiosPrivate } from "../../api/axios";

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
  },[]);

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const routes = {
    Movies: "/movies",
    Schedule: "/schedule",
    Theatres: "/theatres",
    Home: "/",
  };

  const getSelectedItem = () => {
    const currentPath = location.pathname;

    if (currentPath.includes("/movie")) {
      return "Movies";
    } else if (currentPath.includes("/schedule")) {
      return "Schedule";
    } else if (currentPath.includes("/theatre")) {
      return "Theatres";
    }
    return "Home";
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

  // console.log("userDetails", userDetails.avatar);

  return (
    <div
      className={`fixed text-white left-0 top-0 w-full pr-5 z-50 flex ${
        isScrolled
          ? "bg-black bg-opacity-100 h-16"
          : "bg-gradient-to-b from-[rgba(0,0,0,0.8)] h-16  to-transparent "
      } transition-all duration-1000 ease-in-out justify-between items-center`}
    >
      <div
        className={`${
          isMenuOpen ? "block " : "hidden"
        } md:flex flex-grow justify-center items-center relative inset-0 `}
      >
        <ul
          className={`flex text-white flex-col md:flex-row md:space-x-24 text-lg md:rounded-none rounded-b-lg md:p-0 absolute top-8 md:static md:top-16  md:right-0 ${
            isMenuOpen ? "bg-black pt-0 px-4 mt-0" : ""
          }
            transition-colors duration-500 ease-in-out`}
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

      <div className="ml-4 md:hidden absolute left-2 top-3">
        {isMenuOpen ? (
          <CloseIcon onClick={toggleMenu} className="cursor-pointer" />
        ) : (
          <MenuIcon onClick={toggleMenu} className="cursor-pointer" />
        )}
      </div>

      <div className="flex items-center absolute right-5 top-2 ">
        {user?.token ? (
          <div className="flex flex-row gap-3 ">
            <img
              src={userDetails.avatar}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <button className=" cursor-pointer" onClick={signOut}>
              <div className="px-4 sm:py-2 py-1 rounded-xl bg-blue-700 hover:bg-blue-900">
                Logout
              </div>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="cursor-pointer bg-blue-800 hover:bg-blue-900 rounded-xl"
          >
            <div className="flex flex-row gap-3 text-white px-4 sm:py-2 py-1 rounded-xl  ">
              Login
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
