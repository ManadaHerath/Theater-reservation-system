import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";
export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    address: "",
    birthday: "",
    gender: "",
    phone_number: "",
    avatar: "",
  });
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Return an empty string if the date is undefined or invalid
    try {
      return new Date(isoDate).toISOString().split("T")[0];
    } catch (error) {
      console.error("Invalid date:", isoDate);
      return ""; // Return an empty string if the date is invalid
    }
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get("/users/getUser");
        console.log("Profile:", response.data[0].full_name);
        setProfile(response.data[0]);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchProfile();
  }, [axiosPrivate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setSelectedFile(file);

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: fileURL,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", profile.full_name);
    formData.append("address", profile.address);
    formData.append("birthday", profile.birthday);
    formData.append("gender", profile.gender);
    formData.append("phone_number", profile.phone_number);
    formData.append("avatar", selectedFile || profile.avatar);

    if (selectedFile) {
      // Upload the selected photo to the backend
      setUploading(true);
      const photoResponse = await axiosPrivate.post(
        "/photo-upload/user-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);

      // Attach the uploaded avatar URL to the form data
      if (photoResponse && photoResponse.data && photoResponse.data[0]) {
        formData.set("avatar", photoResponse.data[0].avatar);
      }
      console.log("Upload successful:", photoResponse.data[0].avatar);
    }

    try {
      const response = await axiosPrivate.patch(
        "/users/updateProfile",
        formData
      );
      console.log("Profile update response:", response);
      setResponse(response);
    } catch (error) {
      console.error("Profile update error:", error);
    }
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
          open={uploading}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Profile</h2>
      <div style={styles.profileContainer} className="w-[400px] md:w-[600px]">
        <div style={styles.avatarContainer}>
          <img src={profile.avatar} alt="Avatar" style={styles.avatar} />
          <label htmlFor="avatar-upload" style={styles.editIcon}>
            <i className="fas fa-edit"></i> {/* Font Awesome edit icon */}
          </label>
          <input
            id="avatar-upload"
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formatDate(profile.birthday)}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800"
            style={styles.submitButton}
          >
            Save Changes
          </button>
          {uploading && <GradientCircularProgress />}
        </form>
      </div>
      {response ? (
        response.status === 201 ? (
          <Alert
            severity="success"
            style={{ position: "absolute", bottom: "20px", left: "20px" }}
          >
            {response.data}
          </Alert>
        ) : (
          <Alert
            severity="error"
            style={{ position: "absolute", bottom: "20px", left: "20px" }}
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
    minHeight: "90vh",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "2rem",
    marginTop: "50px",
    font: "bold",

    marginBottom: "20px",
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
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },
  editIcon: {
    position: "absolute",
    bottom: "-10px",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#C9D1D9",
  },
  fileInput: {
    display: "none", // Hide the file input, use the edit icon to trigger it
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "15px",
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
