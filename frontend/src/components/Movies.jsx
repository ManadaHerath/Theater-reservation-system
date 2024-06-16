import React from 'react';
import useFetch from '../hooks/useFetch';

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

const MovieList = ()=>{
  const {data,loading,error} = useFetch('http://localhost:5001/movies');
  if(loading){
    return <p>Loading...</p>
  }
  // if(error){
  //   console.log(error)  should chedk on later why this gives an empty array as an error
  // }
  return(
    <div className="movie-list">
      {data.map(movie =>( 
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
  )
}



export default MovieList;
