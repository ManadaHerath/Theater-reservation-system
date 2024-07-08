import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Rating } from "@mui/material";

const Review = ({ review, onLike, onReply }) => {
  const [reply, setReply] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(review.id, reply);
    setReply("");
    setShowReplyField(false);
  };

  return (
    <Box sx={{ mt: 3, ml: 5 }}>
      <div className="flex flex-row space-x-3">
        <img
          src={review.avatar}
          alt="profile"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <Typography variant="h6" sx={{ color: "white" }}>
          {review.name}
        </Typography>
      </div>
      <Typography variant="body1" sx={{ color: "white" }}>
        {review.text}
      </Typography>
      <Rating
        value={review.rating}
        readOnly
        sx={{ "& .MuiRating-iconFilled": { color: "white" } }}
      />
      <Button variant="text" color="primary" onClick={() => onLike(review.id)}>
        {review.liked ? `Unlike (${review.likes})` : `Like (${review.likes})`}
      </Button>
      <Button
        variant="text"
        color="primary"
        onClick={() => setShowReplyField(!showReplyField) }
      >
        Reply
      </Button>
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 1 }}
          >
            Submit
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2, ml: 5 }}>
        {review.replies.map((reply, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Typography variant="body2" style={{ color: "white" }}>
              <img
                src={reply.avatar}
                alt="profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />{" "}
              <strong>{reply.name}:</strong> {reply.text}
            </Typography>
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default Review;
