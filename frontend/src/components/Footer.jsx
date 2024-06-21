import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full py-4 bg-indigo-600 shadow-md ">
      

      <ul className="flex justify-center space-x-4 text-lg">
        <li>
          <Link to="/help" className="text-gray-200">Help & FAQ</Link>
        </li>
        <li>
          <Link to="/terms" className="text-gray-200">Terms of Use</Link>
        </li>
        <li>
          <Link to="/privacyPolicy" className="text-gray-200">Privacy Policy</Link>
        </li>
      </ul>
    </div>
  );
}

export default Footer;