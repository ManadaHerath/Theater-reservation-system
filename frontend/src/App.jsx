import React , { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "./components/MovieCard";



const App = () => {
  
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching the movie data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="movie-list">
      {movies.map(movie => (
        <MovieCard 
          key={movie.id} 
          title={movie.title}
          trailer_video_url={movie.trailer_video_url}
          poster_url={movie.poster_url}
          overview={movie.overview}
          released_date={movie.released_date}
          duration={movie.duration}
          original_language={movie.original_language}
          age_type={movie.age_type}
          is_active={movie.is_active}
        />
      ))}
    </div>
  );
}

export default App;