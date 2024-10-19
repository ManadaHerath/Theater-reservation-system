import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";

// API key for TMDB
const API_KEY = "3e9c3015bda9f710f8ff839f447c816a";

// Function to fetch movie search results
const fetchMovies = async (searchTerm) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      searchTerm
    )}`
  );
  const data = await response.json();
  return data.results;
};

// Function to fetch movie details by movieId
const fetchMovieDetails = async (movieId) => {
  const movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const movieData = await movieResponse.json();

  const creditsResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
  );
  const creditsData = await creditsResponse.json();

  const videosResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const videosData = await videosResponse.json();

  const trailer = videosData.results.find((video) => video.type === "Trailer");

  return {
    title: movieData.title,
    trailer_video_url: trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : "",
    poster_url: `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`,
    overview: movieData.overview,
    released_date: movieData.release_date,
    duration: `${Math.floor(movieData.runtime / 60)} hrs ${
      movieData.runtime % 60
    } mins`,
    original_language: movieData.original_language,
    movie_director: creditsData.crew.find((member) => member.job === "Director")
      ?.name,
    movie_writer:
      creditsData.crew.find((member) => member.job === "Screenplay")?.name ||
      creditsData.crew.find((member) => member.job === "Writer")?.name,
    cover_photo: `https://image.tmdb.org/t/p/w500/${movieData.backdrop_path}`,
    rating: movieData.vote_average / 2,
    actors: creditsData.cast.slice(0, 2).map((actor) => ({
      name: actor.name,
      photo_url: `https://image.tmdb.org/t/p/w500/${actor.profile_path}`,
    })),
  };
};

export default function AddNewMovieViaIMDB() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  // Fetch movies when search term is updated
  useEffect(() => {
    if (searchTerm.length > 3) {
      setLoading(true);
      fetchMovies(searchTerm).then((data) => {
        setSearchResults(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  // Fetch movie details when a movie is selected
  const handleMovieSelect = (movieId) => {
    setLoading(true);
    fetchMovieDetails(movieId).then((movieDetails) => {
      setSelectedMovie(movieDetails);
      //console.log("movie Details", movieDetails);
      setLoading(false);
    });
  };

  // Handle adding the movie (You can store or handle the movie details here)
  const handleAddMovie = async () => {
    //console.log("Movie added:", selectedMovie);

    try {
      setLoading(true);
      const response = await axiosPrivate.post("/movies", {
        movie: selectedMovie,
        actors: selectedMovie.actors,
      });
      setResponse(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setResponse("");
    }, 5000);

    setSelectedMovie(null);
    setSearchTerm("");
    setSearchResults([]);
  };

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
    <div className="text-white my-3">
      <h1 className="text-lg md:text-xl font-semibold mb-4">
        Search for a movie to add
      </h1>
      <div className="relative">
        <input
          className="border border-blue-600 p-2 rounded-md w-full text-black pr-10" // Added pr-10 for right padding
          type="text"
          placeholder="Search for a movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
      </div>

      {loading ? (
        <GradientCircularProgress />
      ) : selectedMovie ? (
        <div className="movie-details my-4 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-3">{selectedMovie.title}</h2>
          <img
            src={selectedMovie.poster_url}
            alt={selectedMovie.title}
            className="w-64 mb-4"
          />
          <div className="text-lg mb-4">
          <p>Released: {selectedMovie.released_date}</p>
          <p>Original Language: {selectedMovie.original_language}</p>
        <p>Duration: {selectedMovie.duration}</p>
        <p>Rating: {selectedMovie.rating}</p>
        </div>
        <div>
          <button
            className="bg-green-500 py-2 px-3 rounded-md mr-4"
            onClick={handleAddMovie}
          >
            Add
          </button>
          <button
            className="bg-red-500 p-2 rounded-md"
            onClick={() => setSelectedMovie(null)}
          >
            Cancel
          </button>
          </div>
        </div>
      ) : (
        <ul className="movie-list">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              onClick={() => handleMovieSelect(movie.id)}
              className="cursor-pointer flex items-center my-2"
            >
              <img
                src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                alt={movie.title}
                className="w-12 h-16 mr-4"
              />
              <span>{movie.title}</span>
            </li>
          ))}
        </ul>
      )}
      {response && (
        <Alert
          severity={
            response.status === 201
              ? "success"
              : response.status === 500
              ? "error"
              : "info"
          }
          style={{ marginTop: "1rem" }}
        >
          {response.data.message}
        </Alert>
      )}
    </div>
  );
}
