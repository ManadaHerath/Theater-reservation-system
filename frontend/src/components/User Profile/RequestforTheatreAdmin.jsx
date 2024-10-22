import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

export default function TheatreAdminRequest() {
  const axiosPrivate = useAxiosPrivate();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosPrivate.post("/users/requestTheatreAdmin", form).then((response) => {
      setResponse(response);
      console.log(response);
      setLoading(false);
      setForm({ description: "" });
      console.log("Theatre Admin Request Submitted:", form.description);
    });
    setTimeout(() => {
      setResponse("");
    }, 5000);
  };

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }

  if (loading) return <GradientCircularProgress />;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Request for Theatre Admin</h2>
      <p style={styles.instruction}>
        Please enter all the details of the theatre, and we will check and get
        back to you.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            style={styles.textarea}
            required
            placeholder="Enter theatre details here..."
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Request for Theatre Admin
        </button>
      </form>
      {response && response.data && (
        <Alert
          severity={
            response.status === 201
              ? "success"
              : response.status === 500
              ? "error"
              : "info"
          }
          style={{ marginTop: "1rem" }}
        >
          {response.data}
        </Alert>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0D1117",
    color: "#C9D1D9",
    minHeight: "60vh",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  instruction: {
    fontSize: "1rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#161B22",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0D1117",
    color: "#C9D1D9",
    border: "1px solid #30363D",
    borderRadius: "5px",
    minHeight: "100px",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    color: "#fff",
    backgroundColor: "#1CB5E0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
