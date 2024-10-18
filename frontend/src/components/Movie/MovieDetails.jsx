import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { axiosPrivate } from "../../api/axios";
import AddReview from "../Reviews/AddReviews";
import ReviewList from "../Reviews/ShowReviewList";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
export default function MovieDetails() {
  const { id } = useParams();
  const [movie_id, setMovie_id] = useState(id);
  const [disable, setDisable] = useState(true);
  const [userRatingvalue, setUserRatingValue] = useState(0.0);
  const [userDetails, setUserDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const[loading,setLoading]=useState(false);
  const navigate = useNavigate();

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={isPending||loading}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }

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
      const reviewReply = await axiosPrivate.post(`/movie_reviews/reply`, {
        id,
        reply,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error replying review:", error);
    }
  };

  const updateReviewLikes = async (id) => {
    try {
      const reviewLikes = await axiosPrivate.patch(`/movie_reviews/like`, {
        id,
      });
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const sendReview = async (review) => {
    try {
      const reviewPayload = {
        ...review,
        movie_id: movie_id,
      };
      const reviewResponse = await axiosPrivate.post(
        `/movie_reviews/addReview`,
        reviewPayload
      );
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
        movie_id: movie_id,
      };
      const ratingResponse = await axiosPrivate.post(
        "/movie_reviews/addRating",
        ratingPayload
      );
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  const handleClick = () => {
    navigate(`/schedule/m${id}`);
  };

  const handleUrlClick = () => {
    window.location.href = movie.trailer_video_url;
  };

  const { data: movie, error, isPending } = useFetch(`/movies/${id}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/users/getUser");
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/movie_reviews/${id}`);
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchUserRating = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/movie_reviews/rating/${id}`);
        setUserRatingValue(response.data.rates);
        setLoading(false);
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

  if (isPending || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <GradientCircularProgress/> {/* Loading spinner */}
      </div>
    );

  return (
    <div className="">
      <div className="max-h-full bg-black">
        <div className="relative">
          <img
            src={movie.cover_photo}
            alt="profile"
            className="w-full h-auto object-contain"
          />

          {/* Black overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

          {/* Text content */}
          <div className="absolute bottom-3 left-5 md:bottom-10 md:left-10 flex flex-col md:space-y-4 space-y-3 text-white">
            <h1 className="text-2xl lg:text-6xl font-bold">{movie.title}</h1>
            <span className="text-xl">{movie.overview}</span>
            <div className="flex flex-row lg:space-x-8 space-x-3">
              <Button variant="contained" onClick={handleUrlClick}>
                Watch Trailer
              </Button>
              <Button variant="contained" onClick={handleClick}>
                Book Ticket
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1">
          <div>
            <h1 className="lg:text-5xl text-xl font-bold ml-10 mt-5 text-white">
              {movie.duration}
            </h1>
            <Box className="my-3 mx-10">
              <Rating
                name="half-rating-read"
                value={parseFloat(movie.rating).toFixed(1) || 0}
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
          <div>
            <h1 className="lg:text-xl text-lg font-bold ml-10 mt-5 text-white flex flex-col">
              <span>Released Date: </span>
              <span className="text-md lg:text-base font-thin">
                {new Date(movie.released_date).toDateString()}
              </span>
            </h1>
            <h1 className="lg:text-xl text-lg font-bold ml-10 mt-5 text-white flex flex-col">
              <span>Directed By: </span>
              <span className="text-md lg:text-base font-thin">
                {movie.movie_director}
              </span>
            </h1>
            <h1 className="lg:text-xl text-lg font-bold ml-10 mt-5 text-white flex flex-col">
              <span>Written By: </span>
              <span className="text-md lg:text-base font-thin">
                {movie.movie_writter}
              </span>
            </h1>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 text-white ml-10 lg:mt-10 mt-5">
          <div className="text-xl lg:text-5xl font-bold">Cast</div>
          <div>
            {movie.actors &&
              movie.actors.map((actor, index) => (
                <div key={index} className="flex flex-row space-x-5 mt-5">
                  <img
                    src={actor.avatar}
                    alt={actor.name}
                    className="lg:size-28 size-16 rounded-full"
                  />
                  <div className="flex flex-col items-center justify-center lg:text-xl">
                    <span>{actor.name}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 ">
          <h1 className="lg:text-5xl text-xl font-bold mt-5 ml-10 text-white">
            {disable ? "Please login to rate" : "Rate Now"}
          </h1>
          <Box className="flex items-end mt-5 ml-10">
            <Typography component="legend"></Typography>
            <Rating
              name="half-rating"
              precision={0.5}
              value={parseFloat(userRatingvalue).toFixed(1) || 0}
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
        <h1 className="lg:text-5xl text-xl font-bold mt-5 ml-10 text-white">
          Reviews
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 md:mt-5 pb-8">
          <AddReview
            onSubmit={handleAddReview}
            disable={disable}
            photo={userDetails && userDetails[0]?.avatar}
          />

          <ReviewList
            reviews={reviews}
            onLike={handleLikeReview}
            onReply={handleReplyReview}
            disable={disable}
          />
        </div>
      </div>
    </div>
  );
}
