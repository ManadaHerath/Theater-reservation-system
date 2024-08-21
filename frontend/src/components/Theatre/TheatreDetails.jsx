import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import AddReview from "../Reviews/AddReviews";
import ReviewList from "../Reviews/ShowReviewList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "axios";

export default function Theatre() {
  const axiosPrivate = useAxiosPrivate();
  const [userDetails, setUserDetails] = useState([]);
  const [disable, setDisable] = useState(true);
  const [userRatingvalue, setUserRatingValue] = useState(0.0);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  console.log(id);
  const [theatre_id, setTheatre_id] = useState(id);

  const handleAddReview = (review) => {
    sendReview(review);
  };

  const handleLikeReview = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id
          ? {
              ...review,
              likes: review.liked ? review.likes - 1 : review.likes + 1,
              liked: !review.liked,
            }
          : review
      )
    );
    updateReviewLikes(id);
  };

  const handleReplyReview = (id, reply) => {
    sendReplyReview(id, reply);
  };

  const sendReplyReview = async (id, reply) => {
    try {
      const reviewReply = await axiosPrivate.post(
        `http://localhost:5001/reviews/reply`,
        {
          id,
          reply,
        }
      );
      console.log(reviewReply.data);
      window.location.reload();
    } catch (error) {
      console.error("Error replying review:", error);
    }
  };

  const updateReviewLikes = async (id) => {
    try {
      const reviewLikes = await axios.patch(
        `http://localhost:5001/reviews/like`,
        {
          id,
        }
      );
      console.log(reviewLikes.data);
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const sendReview = async (review) => {
    try {
      const reviewPayload = {
        ...review,
        theatre_id: theatre_id,
      };
      const reviewResponse = await axiosPrivate.post(
        `http://localhost:5001/reviews/addReview`,
        reviewPayload
      );
      console.log(reviewResponse.data);
      window.location.reload();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  useEffect(() => {
    sendUserRating(userRatingvalue);
  }, [userRatingvalue]);

  const sendUserRating = async (rating) => {
    try {
      const ratingPayload = {
        rating: rating,
        theatre_id: theatre_id,
      };
      const ratingResponse = await axiosPrivate.post(
        "http://localhost:5001/reviews/addRating",
        ratingPayload
      );
      console.log(ratingResponse.data);
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  const navigate = useNavigate();

  const {
    data: details,
    loading,
    error,
  } = useFetch(`http://localhost:5001/theatres/${id}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(
          "http://localhost:5001/users/getUser"
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5001/reviews/${id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchUserRating = async () => {
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5001/reviews/rating/${id}`
        );
        setUserRatingValue(response.data.rates);
        console.log("user Rating Value", response.data.rates);
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchData();
    fetchReviews();
    fetchUserRating();
  }, []);

  useEffect(() => {
    if (userDetails && userDetails.length > 0 && userDetails[0] !== null) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [userDetails]);
  if (loading) return <p>Loading...</p>;
  if (error.length > 0) return <p>error...</p>;

  const handleonClick = () => {
    navigate(`/schedule/${id}`);
  };

  return (
    <div className="max-h-full pb-10 bg-black">
      <div className="relative">
        <img src={details.image_url} alt="profile" className="size-full" />
        {/* Dark Canvas Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        <div className="text-2xl lg:text-5xl font-bold absolute text-white bottom-10 left-10 flex flex-col md:space-y-4 space-y-1">
          <span> {details.name}</span>
          <span> {details.district}</span>
        </div>
      </div>
      <h1 className="lg:text-4xl text-xl font-bold ml-10 mt-5 text-white">
        Movie Show Times at {details.name}
      </h1>
      <button
        onClick={handleonClick}
        className="bg-blue-500 hover:bg-blue-600 font-semibold p-2 text-white rounded-lg mt-5 ml-10 "
      >
        Show Movie Schedule
      </button>
      <hr className="mt-5 w-3/4 h-1 mx-auto bg-white" />

      <p className="lg:text-2xl text-lg ml-10 mt-5 text-white font-semibold">
        {details.details}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <h1 className="lg:text-4xl text-xl font-bold ml-10 mt-5 text-white">
          Contact Details
        </h1>
        <div>
          <p className="lg:text-xl text-lg ml-10 mt-5 text-white">
            Mobile Number : {details.mobile_number}
          </p>
          <p className="lg:text-xl text-lg ml-10 mt-2 lg:mt-2 text-white">
            Email Address : {details.email}
          </p>
          <p className="lg:text-xl text-lg ml-10 mt-2 lg:mt-2 text-white">
            Address : {details.address}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        <h1 className="lg:text-4xl text-xl font-bold ml-10 mt-5 text-white">
          Ratings
        </h1>
        <div className="flex flex-row space-x-5">
          <p className="lg:text-4xl mt-5 ml-12 text-xl text-white font-bold">
            {details.rating}/5
          </p>
          <Box className="my-auto justify-items-center items-center">
            <Rating
              name="half-rating-read"
              value={parseFloat(details.rating).toFixed(1)}
              precision={0.5}
              readOnly
              size="large"
              sx={{
                "& .MuiRating-iconEmpty": {
                  color: "white",
                },
              }}
            />
          </Box>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        <h1 className="lg:text-4xl text-xl font-bold ml-10 mt-5 text-white">
          Location
        </h1>
        <iframe
          title="location"
          className="w-3/4 h-3/4 ml-10 mt-5 lg:w-96 lg:h-96"
          src={details.location}
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 ">
        <h1 className="lg:text-4xl text-xl font-bold mt-5 ml-10 text-white">
          {disable ? "Please login to rate" : "Rate Now"}
        </h1>
        <Box className="ml-10">
          <Typography component="legend">Controlled</Typography>
          <Rating
            name="half-rating"
            precision={0.5}
            value={parseFloat(userRatingvalue).toFixed(1)}
            size="large"
            onChange={(event, newValue) => {
              if (!disable) {
                setUserRatingValue(newValue);
              }
            }}
            readOnly={disable}
            sx={{
              "& .MuiRating-iconEmpty": {
                color: "white",
              },
            }}
          />
        </Box>
      </div>
      <h1 className="lg:text-4xl text-xl font-bold mt-5 ml-10 text-white">
        Reviews
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 md:mt-5 pb-8 mb-8">
        <AddReview
          onSubmit={handleAddReview}
          disable={disable}
          photo={userDetails && userDetails[0]?.avatar}
        />

        <ReviewList
          reviews={reviews}
          onLike={handleLikeReview}
          onReply={handleReplyReview}
        />
      </div>
    </div>
  );
}
