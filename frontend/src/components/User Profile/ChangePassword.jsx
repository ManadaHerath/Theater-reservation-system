import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Alert from "@mui/material/Alert";

export default function ChangePassword() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState({
    previous_Password: "",
    new_password: "",
    confirm_password: "",
  });
  const [response, setResponse] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosPrivate.post("/users/changePassword", data);
      setResponse(res);
    } catch (error) {
      console.error("API error:", error);
      const res = error.response;
    }

    setTimeout(() => {
      setResponse("");
      setData({
        previous_Password: "",
        new_password: "",
        confirm_password: "",
      });
    }, 5000);
  };
  const [showPreviousPassword, setShowPreviousPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleShowPreviousPassword = () => {
    setShowPreviousPassword(!showPreviousPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Change Password</h2>
      <div style={styles.profileContainer} className="w-[400px] md:w-[600px]">
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Previous Password</label>
            <input
              type={showPreviousPassword ? "text" : "password"}
              name="previous_Password"
              placeholder="Previous Password"
              value={data.previous_Password}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <span
              onClick={toggleShowPreviousPassword}
              style={{
                position: "absolute",
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "grey",
              }}
            >
              {showPreviousPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              placeholder="New Password"
              value={data.new_password}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <span
              onClick={toggleShowNewPassword}
              style={{
                position: "absolute",
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "grey",
              }}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirm_password"
              value={data.confirm_password}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <span
              onClick={toggleShowConfirmPassword}
              style={{
                position: "absolute",
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "grey",
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800"
            style={styles.submitButton}
          >
            Change Password
          </button>
        </form>
      </div>
      {response ? (
        response.status === 201 ? (
          <Alert
            severity="success"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {response.data}
          </Alert>
        ) : response.status === 200 ? (
          <Alert
            severity="warning"
            style={{
              position: "absolute",
              bottom: "5px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {response.data}
          </Alert>
        ) : (
          <Alert
            severity="error"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {response.data}
          </Alert>
        )
      ) : null}
    </div>
  );
}
const styles = {
  container: {
    backgroundColor: "#0D1117",
    color: "#C9D1D9",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "60px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    font: "bold",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#161B22",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "15px",
    position: "relative",
    display: "block",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#0D1117",
    color: "#C9D1D9",
    border: "1px solid #30363D",
    borderRadius: "5px",
    paddingRight: "40px",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
