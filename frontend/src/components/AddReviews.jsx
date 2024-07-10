import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const AddReview = ({ onSubmit, disable, photo }) => {
  const [review, setReview] = useState("");

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
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid white",
          }}
        />
      )}
      <TextField
        label="Review"
        variant="outlined"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        multiline
        rows={4}
        disabled={disable}
        required
        InputLabelProps={{
          sx: {
            color: "white",
          },
        }}
        InputProps={{
          sx: {
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
            },
            "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: "red",
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
          if (disable | review=="") {
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
          cursor: disable | review=="" ? "not-allowed" : "pointer",
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddReview;
