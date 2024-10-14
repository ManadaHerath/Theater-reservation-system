import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleSignInButton = ({ word }) => {
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.REACT_APP_BASE_URL}/auth/google`;
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
