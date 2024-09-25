import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import TheatreAdminNavbar from "./TheatreAdminNavbar";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Footer from "../Footer";
const TheatreAdminLayout = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarVisible((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginLeft: isNavbarVisible ? "250px" : "0px",
        transition: "margin-left 0.3s",
      }}
    >
      {isNavbarVisible && <TheatreAdminNavbar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={toggleNavbar}
          sx={{
            position: "fixed",
            top: 10,
            left: isNavbarVisible ? "180px" : "10px",
            transition: "left 0.3s",

            zIndex: 2000,
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          {isNavbarVisible ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default TheatreAdminLayout;
