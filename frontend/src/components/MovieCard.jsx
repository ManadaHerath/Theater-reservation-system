import React from 'react';

const MovieCard = (movie) => {
  const handleClick = () => {
    window.location.href = movie.trailer_video_url;
  };

  return (
    <div 
      className={`movie-card ${movie.is_active ? '' : 'inactive'}`}
      onClick={handleClick}
    >
      <img src={movie.poster_url} alt={`${movie.title} Poster`} />
      <div className="movie-details">
        <h3>{movie.title}</h3>
        <p>{movie.overview}</p>
        <p>Released: {new Date(movie.released_date).toDateString()}</p>
        <p>Duration: {movie.duration} min</p>
        <p>Language: {movie.original_language}</p>
        <p>Rating: {movie.age_type}</p>
      </div>
    </div>
  );
};

export default MovieCard;
