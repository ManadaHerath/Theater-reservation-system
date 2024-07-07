import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Rating } from '@mui/material';

const Review = ({ review, onLike, onReply }) => {
  const [reply, setReply] = useState('');
  const [showReplyField, setShowReplyField] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(review.id, reply);
    setReply('');
    setShowReplyField(false);
  };

  return (
    <Box sx={{ mt: 2, ml: 5 }}>
      <Typography variant="h6" sx={{ color: 'white' }}>
        {review.name}
      </Typography>
      <Typography variant="body1" sx={{ color: 'white' }}>
        {review.text}
      </Typography>
      <Rating value={review.rating} readOnly sx={{ "& .MuiRating-iconFilled": { color: "white" } }} />
      <Button variant="text" color="primary" onClick={() => onLike(review.id)}>
        {review.liked ? `Unlike (${review.likes})` : `Like (${review.likes})`}
      </Button>
      <Button variant="text" color="primary" onClick={() => setShowReplyField(!showReplyField)}>
        Reply
      </Button>
      {showReplyField && (
        <Box component="form" onSubmit={handleReplySubmit} sx={{ mt: 1,maxWidth: "400px" }}>
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
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 1 }}>
            Submit
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2, ml: 5 }}>
        {review.replies.map((reply, index) => (
          <Typography key={index} variant="body2" sx={{ color: 'white' }}>
            {reply}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Review;
