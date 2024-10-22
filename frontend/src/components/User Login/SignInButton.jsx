import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleSignInButton = ({ word }) => {
  const handleGoogleSignIn = () => {
    // window.location.href = `http://localhost:5001/auth/google`;
    window.location.href = `https://theater-reservation-system-production.up.railway.app/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="text-white bg-blue-800 p-3 rounded-md hover:bg-blue-900"
    >
      <FontAwesomeIcon icon={faGoogle} className="mr-3" />
      Sign {word} with Google
    </button>
  );
};

export default GoogleSignInButton;
