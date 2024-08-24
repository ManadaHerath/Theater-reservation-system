import {React, useEffect , useState} from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const MovieCard = ({movie}) => {


  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate(); // Hook for navigation

  const handleClick = () => {
   navigate(`/movie/${movie.id}`) // Navigate to the schedule page
  };
  const handlePosterClick  = () =>{
    
    
  }

  const handleUrlClick = () => {
    window.open(movie.trailer_video_url, '_blank');
  }


  return (
    <div
      className="relative overflow-hidden transition-transform duration-300 bg-gray-900 rounded-lg shadow-xl group w-72 h-96 hover:scale-105"
      onClick={handlePosterClick}
    >
      <div className="absolute inset-0">
        <img
          className="object-cover w-full h-full transition-opacity duration-300 transform group-hover:opacity-80"
          src={movie.poster_url}
          alt={`${movie.title} Poster`}
          onError={(e) => {
            e.target.src = 'https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg';
          }}
        />
        
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black group-hover:opacity-50"></div>
      </div>

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 opacity-0 bg-gradient-to-t from-gray-900 to-transparent group-hover:opacity-100">
        <h3 className="mb-2 text-lg font-semibold text-white line-clamp-2">{movie.title}</h3>
        <div className="hidden text-sm text-gray-300 group-hover:block line-clamp-3">
          {movie.overview}
          <p>Released: {new Date(movie.released_date).toDateString()}</p>
          <p>Duration: {movie.duration} min</p>
          <p>Language: {movie.original_language}</p>
          <p>Rating: {movie.age_type}</p>
        </div>
        <div className="flex justify-between mt-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 rounded-full text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleUrlClick}
          >
            Watch Trailer
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 rounded-full text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleClick}
          >
            Buy Tickets
          </button>
        </div>
        
      </div>
    </div>
  );
};

const MovieList = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    if (error.length >0) {
        console.log(error);
    }

  return (
    <div className='flex flex-col justify-center py-4 sm:flex-row sm:space-x-4'>
      {data.map((movie) => ( 
        <MovieCard 
          key={movie.id} 
          movie = {movie}
        />    
      ))}
    </div>
  );
};

export default MovieList;
