import React from "react";
import Review from "./ShowReviews.jsx";

const ReviewList = ({ reviews = [], onLike, onReply }) => {
  console.log(reviews);
  return (
    <div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Review
            key={review.id}
            review={review}
            onLike={onLike}
            onReply={onReply}
          />
        ))
      ) : (
        <p>No reviews available</p>
      )}
    </div>
  );
};

export default ReviewList;
