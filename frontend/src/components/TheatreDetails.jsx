import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import AddReview from "./AddReviews";
import ReviewList from "./ShowReviewList";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function Theatre() {
  const axiosPrivate = useAxiosPrivate();
  const [userDetails, setUserDetails] = useState([]);
  const [disable, setDisable] = useState(true);
  const [value, setValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  // const [reviews, setReviews] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     text: "Great movie!",
  //     rating: 4,
  //     likes: 0,
  //     liked: false,
  //     replies: [],
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     text: "Not bad.",
  //     rating: 3,
  //     likes: 0,
  //     liked: false,
  //     replies: [],
  //   },
  // ]);

  const handleAddReview = (review) => {
    setReviews([
      ...reviews,
      { ...review, id: reviews.length + 1, likes: 0, replies: [] },
    ]);
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
  };

  const handleReplyReview = (id, reply) => {
    setReviews(
      reviews.map((review) =>
        review.id === id
          ? { ...review, replies: [...review.replies, reply] }
          : review
      )
    );
  };

  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const {
    data: details,
    loading,
    error,
  } = useFetch(`http://localhost:5001/theatres/${id}`);

  // const { data: userDetails } = useFetch("http://localhost:5001/users/getUser");

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

    fetchData();
    fetchReviews();
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
    <div className="max-h-full mb-16 bg-black">
      <div className="relative">
        <img src={details.image_url} className="size-full" />
        <h1 className="text-2xl lg:text-5xl  font-bold absolute text-white bottom-10 left-10 flex flex-col md:space-y-4 space-y-1">
          <span> {details.name}</span>
          <span> {details.district}</span>
        </h1>
      </div>
      <h1 className="lg:text-5xl text-xl font-bold ml-10 mt-5 text-white">
        Movie Show Times at {details.name}
      </h1>
      <button
        onClick={handleonClick}
        className="bg-blue-500 hover:bg-blue-600 font-semibold p-2 text-white rounded-lg mt-5 ml-10 "
      >
        Show Movie Schedule
      </button>
      <hr className="mt-5 w-3/4 h-1 mx-auto bg-white" />

      <p className="lg:text-2xl text-lg ml-10 mt-5 text-white">
        {details.details}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <h1 className="lg:text-5xl text-xl font-bold ml-10 mt-5 text-white">
          Contact Details
        </h1>
        <div>
          <p className="lg:text-2xl text-lg ml-10 mt-5 text-white">
            Mobile Number : {details.mobile_number}
          </p>
          <p className="lg:text-2xl text-lg ml-10 mt-2 lg:mt-5 text-white">
            Email Address : {details.email}
          </p>
          <p className="lg:text-2xl text-lg ml-10 mt-2 lg:mt-5 text-white">
            Address : {details.address}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        <h1 className="lg:text-5xl text-xl font-bold ml-10 mt-5 text-white">
          Ratings
        </h1>
        <div className="flex flex-row space-x-5">
          <p className="lg:text-5xl mt-5 ml-12 text-xl text-white font-bold">
            {details.rating}/5
          </p>
          <Box className="my-auto">
            <Rating
              name="read-only"
              value={details.rating}
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
        <h1 className="lg:text-5xl text-xl font-bold ml-10 mt-5 text-white">
          Location
        </h1>
        <iframe
          className="w-3/4 h-3/4 ml-10 mt-5 lg:w-96 lg:h-96"
          src={details.location}
          style={{ border: 0 }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 ">
        <h1 className="lg:text-5xl text-xl font-bold mt-5 ml-10 text-white">
          {disable ? "Please login to rate" : "Rate Now"}
        </h1>
        <Box className="ml-10">
          <Typography component="legend">Controlled</Typography>
          <Rating
            name="simple-controlled"
            value={value}
            size="large"
            onChange={(event, newValue) => {
              if (!disable) {
                setValue(newValue);
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
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
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
