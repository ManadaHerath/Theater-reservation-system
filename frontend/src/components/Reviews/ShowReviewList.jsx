import React from "react";
import Review from "./ShowReviews.jsx";

const ReviewList = ({ reviews = [], onLike, onReply,disable }) => {
  return (
    <div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div data-testid="review" key={review.id}>
            <Review
              key={review.id}
              review={review}
              onLike={onLike}
              onReply={onReply}
              disable={disable}
              
            />
          </div>
        ))
      ) : (
        <p>No reviews available</p>
      )}
    </div>
  );
};

export default ReviewList;
