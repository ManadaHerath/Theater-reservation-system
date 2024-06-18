import React from 'react';
import useFetch from '../hooks/useFetch';

const MovieCard = (movie) => {
  const handleClick = () => {
    window.location.href = movie.trailer_video_url;
  };

  return (
    <div
      className="group relative w-72 h-96 bg-gray-900 rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover transform transition-opacity duration-300 group-hover:opacity-80"
          src={movie.poster_url}
          alt={`${movie.title} Poster`}
          onError={(e) => {
            e.target.src = 'https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
        <div className="hidden group-hover:block text-gray-300 text-sm line-clamp-3">
          {movie.overview}
          <p>Released: {new Date(movie.released_date).toDateString()}</p>
          <p>Duration: {movie.duration} min</p>
          <p>Language: {movie.original_language}</p>
          <p>Rating: {movie.age_type}</p>
        </div>
        <button
          className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-full text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleClick}
        >
          Watch Trailer
        </button>
      </div>
    </div>
  );
};

const MovieList = () => {
  const { data, loading, error } = useFetch('http://localhost:5001/movies');

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error.length >0) {
    console.log(error);
}

  return (
    <div className='flex flex-col sm:flex-row justify-center sm:space-x-4 py-4'>
      {data.map((movie) => ( 
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
};

export default MovieList;
