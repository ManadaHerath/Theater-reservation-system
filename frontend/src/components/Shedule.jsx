import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const MovieScheduleGrid = () => {
  const navigate = useNavigate();
  const { paramId } = useParams();
  const {
    data: showTimes,
    loading,
    error,
  } = useFetch("http://localhost:5001/show_times");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moviesToShow, setMoviesToShow] = useState({});

  useEffect(() => {
    if (showTimes) {
      const filteredMovies = {};
      showTimes.forEach((show) => {
        const showDate = new Date(show.start_time);
        if (
          format(showDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        ) {
          if (
            paramId === undefined ||
            (paramId.startsWith("t") && paramId === show.theatre_id) ||
            (paramId.startsWith("m") && paramId === show.movie_id)
          ) {
            if (!filteredMovies[show.movie_id]) {
              filteredMovies[show.movie_id] = [];
            }
            filteredMovies[show.movie_id].push(show);
          }
        }
      });
      setMoviesToShow(filteredMovies);
    }
  }, [selectedDate, showTimes, paramId]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleShowtimeClick = (showId, theatreId) => {
    navigate(`/seat-selection/${showId}/${theatreId}`);
  };

  const generateDates = (start, numDays) => {
    const dates = [];
    for (let i = 0; i < numDays; i++) {
      dates.push(addDays(start, i));
    }
    return dates;
  };

  const handleNext = () => {
    if (currentIndex < dates.length - 7) {
      setCurrentIndex(currentIndex + 7);
      setSelectedDate(dates[currentIndex + 7]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 7);
      setSelectedDate(dates[currentIndex - 7]);
    }
  };

  const dates = generateDates(new Date(), 30); // Generating 30 days to allow scrolling forward

  if (loading) {
    return <p>Loading showtimes...</p>;
  }

  if (error.length > 0) {
    console.log(error);
  }

  return (
    <div className="container mx-auto pt-16">
      <div className="flex items-center justify-center mb-6 gap-x-4">
        <FiChevronLeft
          className={`text-3xl cursor-pointer ${
            currentIndex === 0 ? "text-gray-700" : "text-white"
          }`}
          onClick={handlePrev}
        />
        <div className="flex overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out">
            {dates.slice(currentIndex, currentIndex + 7).map((date, index) => (
              <div
                key={index}
                className={`flex px-4 py-2 mx-2 my-8 text-center cursor-pointer rounded-md ${
                  format(selectedDate, "yyyy-MM-dd") ===
                  format(date, "yyyy-MM-dd")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleDateClick(date)}
              >
                {format(date, "MMMM d")}
              </div>
            ))}
          </div>
        </div>
        <FiChevronRight
          className={`text-3xl cursor-pointer ${
            currentIndex >= dates.length - 7 ? "text-gray-500" : "text-white"
          }`}
          onClick={handleNext}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-white">
        {Object.keys(moviesToShow).length === 0 ? (
          <p className="text-center">
            No shows available for the selected date.
          </p>
        ) : (
          Object.keys(moviesToShow).map((movieId) => (
            <div key={movieId} className="col-span-1">
              <h3 className="text-xl font-semibold mb-3 text-black-700"></h3>
              {moviesToShow[movieId].map((show) => (
                <div
                  key={show.id}
                  className="border p-3 ml-8 rounded-md shadow-lg mb-3 bg-white cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-blue-500 text-black hover:text-white"
                  onClick={() => handleShowtimeClick(show.id, show.theatre_id)}
                >
                  <h3 className="text-xl font-semibold ">{show.title}</h3>
                  <p>
                    {format(new Date(show.start_time), "hh:mm a")} -{" "}
                    {format(new Date(show.end_time), "hh:mm a")}
                  </p>
                  <p>Theatre: {show.name}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieScheduleGrid;
