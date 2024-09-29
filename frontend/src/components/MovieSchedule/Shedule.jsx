import React, { useState, useEffect,useCallback } from "react";
import { format, addDays } from "date-fns";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const MovieScheduleGrid = () => {
  const navigate = useNavigate();
  const { paramId } = useParams();
  const { data: showTimes, loading, error } = useFetch("/show_times");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moviesToShow, setMoviesToShow] = useState({});
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);

    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

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
    console.log("Yo Yo what", showId, theatreId);
    navigate(`/seatgrid/${showId}/${theatreId}`);
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

  const dates = generateDates(new Date(), 30);

  if (loading) {
    return <p>Loading showtimes...</p>;
  }

  if (error.length > 0) {
    console.log(error);
  }

  return (
    <div className="container mx-auto pt-16 mb-8">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#181826",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse", // Adds the repulse effect on hover
              },
              resize: true, // Adjusts to screen resize
            },
            modes: {
              repulse: {
                distance: 200, // Distance particles repulse from the cursor
                duration: 0.4, // Duration of the repulse effect
              },
            },
          },
          particles: {
            number: {
              value: 50, // Number of particles
              density: {
                enable: true,
                value_area: 800, // Density of particles in the canvas
              },
            },
            color: {
              value: "#ffffff", // Particle color
            },
            shape: {
              type: "circle", // Shape of particles
            },
            opacity: {
              value: 0.5, // Opacity of particles
              random: true, // Randomize opacity
            },
            size: {
              value: 5, // Size of particles
              random: true, // Randomize size
            },
            move: {
              enable: true, // Enable particle movement
              speed: 3, // Speed of movement
              direction: "none", // No specific direction
              random: false, // Not random movement
              straight: false, // Not moving in a straight line
              out_mode: "bounce", // Particles bounce when reaching canvas edges
              attract: {
                enable: false, // Disable particle attraction
              },
            },
          },
          detectRetina: true,
        }}
      />
      <div className="flex items-center justify-center mb-6 lg:gap-x-4">
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
                className={`flex lg:px-4 px-1 py-2 mx-1 lg:mx-2 lg:my-8 text-xs lg:text-base text-center cursor-pointer rounded-md ${
                  format(selectedDate, "yyyy-MM-dd") ===
                  format(date, "yyyy-MM-dd")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
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
      <div className="gap-6 text-white mx-auto">
        {Object.keys(moviesToShow).length === 0 ? (
          <p className="text-center">
            No shows available for the selected date.
          </p>
        ) : (
          Object.keys(moviesToShow).map((movieId) => (
            <div key={movieId} className="col-span-1">
              <h3 className="text-xl font-semibold mb-3 text-black-700"></h3>
              {Object.entries(
                moviesToShow[movieId].reduce((groupedShows, show) => {
                  if (!groupedShows[show.name]) {
                    groupedShows[show.name] = [];
                  }
                  groupedShows[show.name].push(show);
                  return groupedShows;
                }, {})
              ).map(([theatreName, shows]) => (
                <div key={theatreName} className="mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 text-center mx-5">
                    {theatreName} - {shows[0].district}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                    {shows.map((show) => (
                      <div
                        key={show.id}
                        className="border mx-auto p-3 lg:h-32 lg:w-auto w-1/2 rounded-md shadow-lg mb-3 bg-gray-300 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-blue-500 text-black hover:text-white"
                        onClick={() =>
                          handleShowtimeClick(show.id, show.theatre_id)
                        }
                      >
                        <h3 className="text-xl lg:text-2xl font-semibold text-center">
                          {show.title}
                        </h3>
                        <p className="text-center">
                          {format(new Date(show.start_time), "hh:mm a")} -{" "}
                          {format(new Date(show.end_time), "hh:mm a")}
                        </p>
                      </div>
                    ))}
                  </div>
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
