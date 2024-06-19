import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns'; // Date manipulation functions
import useFetch from '../hooks/useFetch'; // Your custom useFetch hook

const MovieScheduleGrid = () => {
    const { data: showTimes, loading, error } = useFetch('http://localhost:5001/show_times'); // Update with your API endpoint
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [moviesToShow, setMoviesToShow] = useState({});
  
    useEffect(() => {
      // Filter showtimes for the selected date
      if (showTimes) {
        const filteredMovies = {};
  
        showTimes.forEach(show => {
          const showDate = new Date(show.start_time);
          if (format(showDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
            if (!filteredMovies[show.movie_id]) {
              filteredMovies[show.movie_id] = [];
            }
            filteredMovies[show.movie_id].push(show);
          }
        });
  
        setMoviesToShow(filteredMovies);
      }
    }, [selectedDate, showTimes]);
  
    const goToNextDay = () => {
      setSelectedDate(addDays(selectedDate, 1));
    };
  
    const goToPreviousDay = () => {
      setSelectedDate(subDays(selectedDate, 1));
    };
  
    if (loading) {
      return <p>Loading showtimes...</p>;
    }
  
    if (error.length >0) {
        console.log(error);
    }

    const handleShowtimeClick = (showId) => {
        console.log(`Showtime with ID ${showId} clicked`);
    }
  
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-600">Movie Schedule Grid</h2>
        <div className="flex items-center justify-between mb-6">
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded-md mr-2 hover:bg-indigo-600 transition-colors duration-200"
            onClick={goToPreviousDay}
          >
            Previous Day
          </button>
          <div className="text-xl font-bold text-gray-700">
            {format(selectedDate, 'eeee, MMMM d, yyyy')}
          </div>
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded-md ml-2 hover:bg-indigo-600 transition-colors duration-200"
            onClick={goToNextDay}
          >
            Next Day
          </button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {Object.keys(moviesToShow).map(movieId => (
            <div key={movieId} className="col-span-1">
              <h3 className="text-xl font-semibold mb-3 text-black-700">{movieId}</h3>
              {moviesToShow[movieId].map(show => (
                <div 
                  key={show.id} 
                  className="border p-3 rounded-md shadow-lg mb-3 bg-white cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                  onClick={() => handleShowtimeClick(show.id)}
                >
                  <p className="text-gray-800">{format(new Date(show.start_time), 'hh:mm a')} - {format(new Date(show.end_time), 'hh:mm a')}</p>
                  <p className="text-gray-600">Theatre: {show.theatre_id}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
    
  };

export default MovieScheduleGrid;
