import React from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const AdminNavBar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#2d2d2d",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{ marginBottom: 4, color: "white" }}
      >
        Admin Dashboard
      </Typography>
      <Button
        component={NavLink}
        to="/admin"
        end
        color="inherit"
        sx={{
          fontWeight: "bold",
          color: "white",
          marginBottom: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
        style={({ isActive }) => ({
          color: isActive ? "blue" : "white",
        })}
      >
        Home
      </Button>

      <Button
        component={NavLink}
        to="/admin/manage-theatres"
        color="inherit"
        sx={{
          fontWeight: "bold",

          color: "white",
          marginBottom: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
        style={({ isActive }) => ({
          color: isActive ? "blue" : "white",
        })}
      >
        Manage Theatres
      </Button>

      <Button
        component={NavLink}
        to="/admin/movie"
        color="inherit"
        sx={{
          fontWeight: "bold",

          color: "white",
          marginBottom: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
        style={({ isActive }) => ({
          color: isActive ? "blue" : "white",
        })}
      >
        Manage Movies
      </Button>

      <Button
        component={NavLink}
        to="/admin/refunds"
        color="inherit"
        sx={{
          fontWeight: "bold",

          color: "white",
          marginBottom: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
        style={({ isActive }) => ({
          color: isActive ? "blue" : "white",
        })}
      >
        Refund Requests
      </Button>
      <Button
        component={NavLink}
        to="/admin/discounts"
        color="inherit"
        sx={{
          fontWeight: "bold",

          color: "white",
          marginBottom: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
        style={({ isActive }) => ({
          color: isActive ? "blue" : "white",
        })}
      >
        Create Discounts
      </Button>

      <Button
        component={NavLink}
        to="/admin/users"
        color="inherit"
        sx={{
          fontWeight: "bold",

          color: "white",
          marginBottom: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
        style={({ isActive }) => ({
          color: isActive ? "blue" : "white",
        })}
      >
        Manage Users
      </Button>

      <Button
        component={NavLink}
        onClick={signOut}
        color="inherit"
        sx={{
          fontWeight: "bold",
          color: "white",
          marginBottom: 2,
          position: "absolute",
          padding: 1,
          bottom: 5,
          marginX: "auto",
          backgroundColor: "red",
          "&.active": { color: "white" },
          "&:hover": { backgroundColor: "red" },
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default AdminNavBar;
