import React from "react";
import { Link } from "react-router-dom";
import search_logo from "../assets/search-w.png";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between h-16 p-4 text-white bg-gray-800">
      <div className="flex items-center p-2 space-x-2 bg-gray-700 rounded-full">
        <input
          type="text"
          placeholder="Search"
          className="p-1 text-lg text-white placeholder-gray-400 bg-transparent border-0 outline-none"
        />
        <img src={search_logo} alt="search" className="w-5 cursor-pointer" />
      </div>
      <ul className="flex space-x-4 text-lg">
        <li>
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/movies" className="hover:text-gray-400">
            Movies
          </Link>
        </li>
        <li>
          <Link to="/schedule" className="hover:text-gray-400">
            Schedule
          </Link>
        </li>
        <li>
          <Link to="/theatres" className="hover:text-gray-400">
            Theatres
          </Link>
        </li>
        {user.token ? (
          <li onClick={signOut} className="hover:text-gray-400 cursor-pointer">
            Logout
          </li>
        ) : (
          <>
            <li className="text-sm">
              <Link to="/register" className="hover:text-gray-400">
                Register
              </Link>
            </li>
            <li className="text-sm">
              <Link to="/login" className="hover:text-gray-400">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default NavBar;
