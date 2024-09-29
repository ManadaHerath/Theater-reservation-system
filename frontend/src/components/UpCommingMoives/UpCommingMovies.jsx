import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const colorClasses = [
  "bg-blue-950", // Dark blue
  "bg-blue-700", // Light blue
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
    <div className="pb-20 transform w-[25%]">
      <div className="relative w-full h-96">
        <img
          className="object-cover w-full h-full  hover:scale-105"
          src={movie.poster_url}
          alt={`${movie.title} Poster`}
          onError={(e) => {
            e.target.src =
              "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg"; // Fallback image if there's an error
          }}
        />
      </div>

      {/* Description Box */}
      <div className={`p-4 ${colorClass}`}>
        {" "}
        {/* Description box with no gap from the image */}
        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
        <div className="mt-2 text-sm text-gray-300">
          {" "}
          {/* Add a small margin on top */}
          {movie.overview && <p className="line-clamp-3">{movie.overview}</p>}
          <p>Released: {new Date(movie.released_date).toDateString()}</p>
          <p>Duration: {movie.duration} min</p>
          <p>Language: {movie.original_language}</p>
          <p>Rating: {movie.age_type}</p>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/movies");
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error.length > 0) {
    console.log(error);
  }

  return (
    <div className="relative pt-8">
      <h1 className="absolute top-0 flex pt-4 pb-20 pr-20 lg:text-3xl text-xl text-white left-20">
        Upcoming Movies
      </h1>
      <div className="flex pt-10 px-8">
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
