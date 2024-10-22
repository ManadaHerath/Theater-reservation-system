import React, { useState, useEffect } from 'react';
import axiosPrivate from "../../../api/axios";
import {useNavigate } from 'react-router-dom';



const CreateCoupon = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState('once');
  const [couponId, setCouponId] = useState('free-period');
  const [percentOff, setPercentOff] = useState(100);
  const [type, setType] = useState('not'); // 'seasonal' or 'not'
  const [endDate, setEndDate] = useState(''); // End date for seasonal coupon
  const [selectedTheatres, setSelectedTheatres] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState('');
  const [isLocationBased, setIsLocationBased] = useState(false);
  const [isMovieBased, setIsMovieBased] = useState(false);

  // Fetch theatres
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await axiosPrivate.get('/theatres');
        setTheatres(response.data);
      } catch (error) {
        console.error('Error fetching theatres:', error);
      }
    };
    fetchTheatres();
  }, []);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosPrivate.get('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  // Toggle selection for theatres
  const toggleTheatreSelection = (id) => {
    setSelectedTheatres((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((theatreId) => theatreId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Toggle selection for movies
  const toggleMovieSelection = (id) => {
    setSelectedMovies((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((movieId) => movieId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post('/coupons/create-coupon', {
        duration,
        id: couponId,
        percent_off: percentOff,
        type,
        end_date: type === 'seasonal' ? endDate : null, // Only send end_date if the type is seasonal
        theatre_ids: isLocationBased ? selectedTheatres : [], // Send selected theatres if location based
        movie_ids: isMovieBased ? selectedMovies : [], // Send selected movies if movie based
      });
      if (response.status === 200)
        setMessage(`Coupon created successfully`);
      setTimeout(() => { navigate('/admin'); }, 2000);
      
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create a Coupon</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon ID */}
          <div>
            <label className="block text-gray-400">Coupon ID:</label>
            <input
              type="text"
              value={couponId}
              onChange={(e) => setCouponId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Coupon ID"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-400">Duration:</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="once">Once</option>
              <option value="forever">Forever</option>
              <option value="repeating">Repeating</option>
            </select>
          </div>

          {/* Percent Off */}
          <div>
            <label className="block text-gray-400">Percent Off:</label>
            <input
              type="number"
              value={percentOff}
              onChange={(e) => setPercentOff(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Percent Off"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-gray-400">Coupon Type:</label>
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  value="seasonal"
                  checked={type === 'seasonal'}
                  onChange={() => setType('seasonal')}
                  className="mr-2"
                />
                Seasonal
              </label>
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  value="not"
                  checked={type === 'not'}
                  onChange={() => setType('not')}
                  className="mr-2"
                />
                Not Seasonal
              </label>
            </div>
          </div>

          {/* End Date Picker (only for Seasonal) */}
          {type === 'seasonal' && (
            <div>
              <label className="block text-gray-400">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Theatre Based Selection */}
          <div>
            <label className="block text-gray-400">Location Based:</label>
            <label className="flex items-center text-gray-400">
              <input
                type="radio"
                value="locationBased"
                checked={isLocationBased}
                onChange={() => {
                  setIsLocationBased(true);
                }}
                className="mr-2"
              />
              Enable
            </label>
            <label className="flex items-center text-gray-400">
              <input
                type="radio"
                value="locationNotBased"
                checked={!isLocationBased}
                onChange={() => setIsLocationBased(false)}
                className="mr-2"
              />
              Disable
            </label>
          </div>

          {/* Theatre Selector */}
          {isLocationBased && (
            <div>
              <label className="block text-gray-400">Select Theatres:</label>
              <div className="grid grid-cols-2 gap-2">
                {theatres.map((theatre) => (
                  <button
                    key={theatre.id}
                    type="button"
                    onClick={() => toggleTheatreSelection(theatre.id)}
                    className={`px-3 py-2 rounded-md text-white ${
                      selectedTheatres.includes(theatre.id) ? 'bg-blue-600' : 'bg-gray-700'
                    } hover:bg-blue-500 focus:outline-none`}
                  >
                    {theatre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Movie Based Selection */}
          <div>
            <label className="block text-gray-400">Movie Based:</label>
            <label className="flex items-center text-gray-400">
              <input
                type="radio"
                value="movieBased"
                checked={isMovieBased}
                onChange={() => {
                  setIsMovieBased(true);
                }}
                className="mr-2"
              />
              Enable
            </label>
            <label className="flex items-center text-gray-400">
              <input
                type="radio"
                value="movieNotBased"
                checked={!isMovieBased}
                onChange={() => setIsMovieBased(false)}
                className="mr-2"
              />
              Disable
            </label>
          </div>

          {/* Movie Selector */}
          {isMovieBased && (
            <div>
              <label className="block text-gray-400">Select Movies:</label>
              <div className="grid grid-cols-2 gap-2">
                {movies.map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => toggleMovieSelection(movie.id)}
                    className={`px-3 py-2 rounded-md text-white ${
                      selectedMovies.includes(movie.id) ? 'bg-blue-600' : 'bg-gray-700'
                    } hover:bg-blue-500 focus:outline-none`}
                  >
                    {movie.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Coupon
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateCoupon;
