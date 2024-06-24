import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleSignInButton = ({ word }) => {
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="text-white bg-gray-900 p-3 rounded-md hover:bg-gray-600"
    >
      <FontAwesomeIcon icon={faGoogle} className="mr-3" />
      Sign {word} with Google
    </button>
  );
};

export default GoogleSignInButton;
