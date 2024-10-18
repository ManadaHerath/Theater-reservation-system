import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TheatreAdminLayout from "../TheatreAdminLayout";
import ReviewList from "../../Reviews/ShowReviewList";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

export default function Reviews() {
  const [theatre, setTheatre] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchTheatreandReviews = async () => {
      try {
        setLoading(true);
        const theatreResponse = await axiosPrivate.get("theatre-admin/theatre");
        const theatreData = theatreResponse.data;
        console.log("Theatre:", theatreData);
        setTheatre(theatreData);

        if (theatreData.id) {
          const response = await axiosPrivate.get(`/reviews/${theatreData.id}`);
          setReviews(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchTheatreandReviews();
  }, [axiosPrivate]);
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
          open={loading}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }
  return (
    <div>
      <TheatreAdminLayout>
        {loading && <GradientCircularProgress />}

        <div className="flex items-center flex-col">
          <h1 className="text-white font-bold text-xl md:text-4xl md:mb-10 md:mt-10 my-5">
            Reviews on {theatre.name}
          </h1>
          <ReviewList reviews={reviews} admin="true" />
        </div>
      </TheatreAdminLayout>
    </div>
  );
}
