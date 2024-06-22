import React,{useState} from "react";
import validator from "validator";



export default function Reset() {
    const [alertStyle, setAlertStyle] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorcolour, setErrorcolour] = useState("");

    const changePassword = () => {
        console.log("Password changed");
  }

  const[password, setPassword] = useState('');
const[confirmPassword, setConfirmPassword] = useState('');
const[alert, setAlert] = useState("");

const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
    if (
      validator.isStrongPassword(e.target.value, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage("Is Strong Password");
      setErrorcolour("green");
    } else {
      setErrorMessage(
        "Is Not Strong Password(Use more than 6 characters, a mix of uppercase and lowercase letters, numbers, and symbols.)"
      );
      setErrorcolour("red");
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };
  const getAlertStyles = (type) => {
    switch (type) {
      case "green":
        return "text-green-600 text-xs mt-1";
      case "red":
        return "text-red-600 text-xs mt-1";
      default:
        return "";
    }
  };

  return (
    <div>
      <section className=" w-screen bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6  rounded-lg shadow dark:border md:mt-0 sm:max-w-md bg-gray-800 border-gray-700 sm:p-8">
            <h1 className="mb-1 font-bold leading-tight tracking-tight flex justify-center md:text-2xl text-white text-2xl sm:text-3xl ">
              Change Password
            </h1>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  name="password"
                  onChange={handlePasswordChange}
                  id="password"
                  placeholder="••••••••"
                  className=" sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                ></input>
              </div>
              {errorMessage && (
                <p className={`${getAlertStyles(errorcolour)}`}>
                  {errorMessage}
                </p>
              )}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                ></input>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    aria-describedby="newsletter"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  ></input>
                </div>
                
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletter"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="/terms"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
            </form>
            
            <button
              onClick={() => changePassword()}
              disabled={password !== confirmPassword}
              className="w-full text-white bg-[#E9522C] hover:bg-[#E9522C]/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mt-3"
            >
              Reset passwod
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}