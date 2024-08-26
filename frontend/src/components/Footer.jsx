import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import facebook_icon from '../assets/facebook_icon.png'
import linkedin_icon from '../assets/linkedin_icon.png'
import twitter_icon from '../assets/twitter_icon.png'
import './Footer.css'

const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1
      ) {
        footer.classList.remove("hidden");
        footer.classList.add("flex");
      } else {
        footer.classList.remove("flex");
        footer.classList.add("hidden");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="footer"
      className="fixed inset-x-0 bottom-0 hidden w-full py-4shadow-md footer"
    >
      <div className="footer-content">
        <div className="footer-content-left">
          <h1 className="text-4xl font-bold">MovieMingle</h1>
          <p>Book your seat now.</p>
          <div className="footer-social-icon">
            <img src={facebook_icon} alt="" />
            <img src={twitter_icon} alt="" />
            <img src={linkedin_icon} alt="" />
          </div>
        </div>

        <div className="footer-content-right">
          <ul >
            <li>
              <Link to="/help">
                Help & FAQ
              </Link>
            </li>
            <li>
              <Link to="/terms">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/privacyPolicy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-content-center">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-456-7898</li>
            <li>contact@moviemingle.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © MovieMingle.com - All Right Reserved.</p>
    </div>
  );
};

export default Footer;
