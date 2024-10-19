import React from "react";
import { Link } from "react-router-dom";
import facebook_icon from "../../assets/facebook_icon.png";
import linkedin_icon from "../../assets/linkedin_icon.png";
import twitter_icon from "../../assets/twitter_icon.png";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content flex flex-col justify-center items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="md:text-4xl text-xl font-bold text-center">
            MovieMingle
          </h1>
          <p className="text-center">Book your seat now.</p>
          <div className="flex flex-row footer-social-icon">
            <img src={facebook_icon} alt="Facebook" />
            <img src={twitter_icon} alt="Twitter" />
            <img src={linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center my-4">
          <h2>GET IN TOUCH</h2>
          <ul className="mx-auto text-center lg:my-4">
            <li>+94 11556768</li>
            <li>contact@moviemingle.com</li>
          </ul>
        </div>

        <div>
          <ul className="flex flex-row justify-evenly gap-5 lg:flex-col ">
            <li>
              <Link to="/help">Help & FAQ</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Use</Link>
            </li>
            <li>
              <Link to="/privacyPolicy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © MovieMingle.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
