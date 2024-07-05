import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const AddReview = ({ onSubmit }) => {
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
        gap: 2,
        mt: 5,
        ml: 5,
        maxWidth: "400px",
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h6" sx={{ color: "white" }}>
        Add a Review
      </Typography>
      <TextField
        label="Review"
        variant="outlined"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        multiline
        rows={4}
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
          },
        }}
        FormHelperTextProps={{
          sx: {
            color: "white",
          },
        }}
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
};

export default AddReview;
