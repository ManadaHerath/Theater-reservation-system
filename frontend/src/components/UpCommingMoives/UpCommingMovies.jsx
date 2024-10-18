import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
const colorClasses = [
  "bg-blue-950", // Dark blue
  "bg-blue-950", // Light blue
];

export const MovieCard = ({ movie, colorClass }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate(); // Hook for navigation

  const handleClick = () => {
    navigate(`/movie/${movie.id}`); // Navigate to the schedule page
  };

  const handleUrlClick = () => {
    window.open(movie.trailer_video_url, "_blank");
  };

  return (
    <div className="pb-20 transform w-[25%] transition-all duration-300 hover:scale-105 cursor-default">
      {/* Movie Poster */}
      <div
        className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg cursor-pointer"
        onClick={handleClick}
      >
        <img
          className="object-cover w-full h-full transform transition-all duration-300 hover:scale-110"
          src={movie.poster_url}
          alt={`${movie.title} Poster`}
          onError={(e) => {
            e.target.src =
              "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg"; // Fallback image if there's an error
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 hover:opacity-100 transition-opacity"></div>
        {/* Watch Trailer Button */}
        <button
          onClick={handleUrlClick}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-lg transition hover:bg-blue-950"
        >
          Watch Trailer
        </button>
      </div>

      {/* Description Box */}
      <div
        className={`p-4 mt-4 rounded-lg shadow-lg transition-all duration-300 ${colorClass}`}
      >
        {/* Movie Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{movie.title}</h3>
        {/* Movie Overview */}
        <div className="mt-2 text-sm text-gray-300">
          {movie.overview && (
            <p className="line-clamp-3 mb-2">{movie.overview}</p>
          )}
          <p className="text-gray-400">Language: {movie.original_language}</p>
          <p className="text-gray-400">Director: {movie.movie_director} </p>
          <p className="text-gray-400">Writer: {movie.movie_writter} </p>
        </div>
      </div>
    </div>
  );
};

const UpCommingMovies = () => {
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
        const response = await axiosPrivate.get("/movies/upcomming");
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
    console.log(error);
  }

  return (
    <div
      className="relative pt-8"
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
      <h1 className="absolute top-2 flex pt-4  pr-20 lg:text-4xl font-bold text-xl text-white left-20">
        Upcoming Movies
      </h1>
      <div className="flex pt-16 px-8 gap-10">
        {data.map((movie, index) =>
          index < 4 ? (
            <MovieCard
              key={movie.id}
              movie={movie}
              colorClass={colorClasses[index % colorClasses.length]}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default UpCommingMovies;
