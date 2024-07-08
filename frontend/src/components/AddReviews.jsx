import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const AddReview = ({ onSubmit, disable,photo }) => {
  const [review, setReview] = useState("");
  console.log("disable", disable);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ review });
    setReview("");
  };


  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        mt: 5,
        ml: 5,
        maxWidth: "400px",
      }}
      onSubmit={handleSubmit}
    >
    
      <Typography variant="h6" sx={{ color: "white" }}>
        {!disable ? "Add a Review" : "Please login to add a review"}
      </Typography>
      {!disable && (
        <img
          src={photo}
          alt="profile"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />  
      )}
      <TextField
        label="Review"
        variant="outlined"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        multiline
        rows={4}
        disabled={disable} // Disable the input if
        required
        InputLabelProps={{
          sx: {
            color: "white", // Label color
          },
        }}
        InputProps={{
          sx: {
            color: "white", // Text color
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "blue", // Initial border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
            },
            "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: "red", // Border color when disabled
            },
          },
        }}
        FormHelperTextProps={{
          sx: {
            color: "white",
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={(e) => {
          if (disable) {
            e.preventDefault();
          } else {
            handleSubmit(e);
          }
        }}
        sx={{
          backgroundColor: disable ? "grey" : "primary.main",
          color: disable ? "white" : "inherit",
          "&:hover": {
            backgroundColor: disable ? "grey" : "primary.dark",
          },
          cursor: disable ? "not-allowed" : "pointer",
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddReview;
