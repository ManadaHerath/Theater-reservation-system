import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";

const AddReview = ({ onSubmit, disable, photo }) => {
  const [review, setReview] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ review });
    setReview("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 5,
        ml: 5,
        maxWidth: "450px",
        backgroundColor: "#1E1E1E",
        borderRadius: "10px",
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" sx={{ color: "white", textAlign: "center" }}>
          {!disable ? "Share Your Experience" : "Please Login to Review"}
        </Typography>

        {!disable && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={photo}
              alt="profile"
              sx={{
                width: 60,
                height: 60,
                border: "2px solid white",
              }}
            />
          </Box>
        )}

        <TextField
          label="Write your review..."
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
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={(e) => {
            if (disable || review === "") {
              e.preventDefault();
            } else {
              handleSubmit(e);
            }
          }}
          sx={{
            backgroundColor: disable ? "grey" : "#007BFF",
            color: disable ? "white" : "inherit",
            "&:hover": {
              backgroundColor: disable ? "grey" : "#0056b3",
            },
            cursor: disable || review === "" ? "not-allowed" : "pointer",
            mt: 2,
          }}
          fullWidth
        >
          Submit Review
        </Button>
      </Box>
    </Paper>
  );
};

export default AddReview;
