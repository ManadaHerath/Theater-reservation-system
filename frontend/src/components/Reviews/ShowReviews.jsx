import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Rating } from "@mui/material";

const Review = ({ review, onLike, onReply, disable, admin }) => {
  const [reply, setReply] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(review.id, reply);
    setReply("");
    setShowReplyField(false);
  };

  return (
    <Box
      sx={{
        mt: 3,
        ml: {
          xs: 2,
          sm: 5,
        },
      }}
    >
      <div className="flex flex-row space-x-3">
        <img
          src={review.avatar}
          alt="profile"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid white,",
          }}
        />
        <div>
          <Typography
            variant="h6"
            sx={{ color: "white", fontFamily: "inherit" }}
          >
            {review.name}
          </Typography>
          <Rating
            value={parseFloat(review.rating).toFixed(1) || 0}
            precision={0.5}
            readOnly
            sx={{
              "& .MuiRating-iconEmpty": {
                color: "white",
              },
            }}
          />
        </div>
      </div>
      <Typography
        variant="body1"
        sx={{
          color: "white",
          fontFamily: "inherit",
          fontSize: {
            xs: "14px", // Margin for extra small screens
            sm: "18px", // Margin for small screens and up
          },
        }}
      >
        {review.text}
      </Typography>
      {!admin && (
        <>
          <Button
            variant="text"
            color="primary"
            onClick={() => onLike(review.id)}
            disabled={disable}
          >
            {review.liked
              ? `Unlike (${review.likes})`
              : `Like (${review.likes})`}
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowReplyField(!showReplyField)}
            disabled={disable}
          >
            Reply
          </Button>
        </>
      )}

      {showReplyField && (
        <Box
          component="form"
          onSubmit={handleReplySubmit}
          sx={{ mt: 1, maxWidth: "400px" }}
        >
          <TextField
            label="Reply"
            variant="outlined"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            required
            fullWidth
            multiline
            rows={2}
            InputLabelProps={{
              sx: {
                color: "white",
                fontFamily: "inherit", // Label color
              },
            }}
            InputProps={{
              sx: {
                color: "white",
                fontFamily: "inherit", // Text color
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 1 }}
          >
            Add Reply
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2, ml: 5 }}>
        {review.replies.map((reply, index) => (
          <div key={index} style={{ marginBottom: "30px" }}>
            <Typography
              variant="body2"
              style={{ color: "white" }}
              className="flex flex-row space-x-3"
            >
              <img
                src={reply.avatar}
                alt="profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "1px solid white",
                }}
              />{" "}
              <strong className="mt-3 ">{reply.name}</strong>
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: "white",
                marginLeft: "60px",
                fontSize: {
                  xs: "12px", // Margin for extra small screens
                  sm: "15px", // Margin for small screens and up
                },
              }}
            >
              {reply.text}
            </Typography>
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default Review;
