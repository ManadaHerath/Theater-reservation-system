import React, { useState } from "react";
import Review from "./ShowReviews.jsx";

const ReviewList = ({ reviews, onLike, onReply }) => {
  console.log(reviews);
  return (
    <div>
      {reviews.map((review) => (
        <Review
          key={review.id}
          review={review}
          onLike={onLike}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default ReviewList;
