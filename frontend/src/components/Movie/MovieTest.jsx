import React, { useEffect, useState } from "react";

import MovieSlideshow from "./MovieSlideshow";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const MovieTest = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/movies");
        console.log("API response: ", response.data);
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <GradientCircularProgress />;
  }

  if (error.length > 0) {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      style={{
        backgroundImage: `
    linear-gradient(rgba(43, 58, 110, 0.7), rgba(40, 40, 50, 0.7)),
    url('https://firebasestorage.googleapis.com/v0/b/medilink-5688e.appspot.com/o/images%2Ffetchpik.com-pNEtHoVwlU.jpg?alt=media&token=ef2ae0db-3178-4744-8a23-56c35b7d843d')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#433B7C",
      }}
    >
      <MovieSlideshow movies={data} />
    </div>
  );
};

export default MovieTest;
