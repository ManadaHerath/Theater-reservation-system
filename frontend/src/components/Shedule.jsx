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
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Movie Schedule Grid</h2>
        <div className="flex items-center justify-between mb-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
            onClick={goToPreviousDay}
          >
            Previous Day
          </button>
          <div className="text-lg font-bold">{format(selectedDate, 'eeee, MMMM d, yyyy')}</div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md ml-2"
            onClick={goToNextDay}
          >
            Next Day
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(moviesToShow).map(movieId => (
            <div key={movieId} className="col-span-1">
              <h3 className="text-lg font-semibold mb-2">{`Movie ${movieId}`}</h3>
              {moviesToShow[movieId].map(show => (
                <div key={show.id} className="border p-2 rounded-md shadow-sm mb-2 cursor-pointer" onClick={() => handleShowtimeClick(show.id)}>
                  <p>{format(new Date(show.start_time), 'hh:mm a')} - {format(new Date(show.end_time), 'hh:mm a')}</p>
                  <p>Theatre: {show.theatre_id}</p>
                  {/* Add onClick handler for booking */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default MovieScheduleGrid;
