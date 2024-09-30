import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TheatreAdminLayout from "../TheatreAdminLayout";
import DatePicker from "react-multi-date-picker"; // Import the multi-date picker

const ShowTimes = () => {
  const [theatre, setTheatre] = useState(null);
  const [showTimes, setShowTimes] = useState([]);
  const [movies, setMovies] = useState([]); // Store the list of movies
  const [newShowTime, setNewShowTime] = useState({
    movie_id: "",
    start_time: "",
    end_time: ""
  });
  const [selectedDates, setSelectedDates] = useState([]); // For storing multiple selected dates

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchTheatreAndShowTimes = async () => {
      try {
        const theatreResponse = await axiosPrivate.get("theatre-admin/theatre");
        const theatreData = theatreResponse.data;
        setTheatre(theatreData);

        if (theatreData.id) {
          const showTimesResponse = await axiosPrivate.get(
            `show_times/theatre/${theatreData.id}`
          );
          setShowTimes(showTimesResponse.data);
        }

        // Fetch the list of movies for the dropdown
        const moviesResponse = await axiosPrivate.get("/movies");
        setMovies(moviesResponse.data);
      } catch (error) {
        console.error("Error fetching theatre or showtimes:", error);
      }
    };

    fetchTheatreAndShowTimes();
  }, [axiosPrivate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShowTime({
      ...newShowTime,
      [name]: value,
    });
  };

  const handleAddShowTime = async (e) => {
    e.preventDefault();
    try {
      // Helper function to format Date object to 'YYYY-MM-DD HH:MM:SS'
      const formatDateForMySQL = (date) => {
        const pad = (num) => num.toString().padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Months are 0-based
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      // Prepare an array of showtimes with combined date and time
      const showTimesToAdd = selectedDates.map((date) => {
        const startDateTime = new Date(date);
        const endDateTime = new Date(date);

        // Set the start time hours and minutes from the newShowTime state
        startDateTime.setHours(newShowTime.start_time.split(':')[0]);
        startDateTime.setMinutes(newShowTime.start_time.split(':')[1]);
        startDateTime.setSeconds(0);

        // Set the end time hours and minutes from the newShowTime state
        endDateTime.setHours(newShowTime.end_time.split(':')[0]);
        endDateTime.setMinutes(newShowTime.end_time.split(':')[1]);
        endDateTime.setSeconds(0);

        return {
          theatre_id: theatre.id,
          movie_id: newShowTime.movie_id,
          start_time: formatDateForMySQL(startDateTime),
          end_time: formatDateForMySQL(endDateTime),
        };
      });

      // Send the entire array of showtimes to the backend at once
      await axiosPrivate.post("/show_times", { showTimes: showTimesToAdd });

      // Reload showtimes after adding
      const updatedShowTimes = await axiosPrivate.get(
        `show_times/theatre/${theatre.id}`
      );
      setShowTimes(updatedShowTimes.data);
      setSelectedDates([]); // Reset selected dates after adding
      setNewShowTime({ movie_id: "", start_time: "", end_time: "" }); // Reset form fields
    } catch (error) {
      console.error("Error adding showtime:", error);
    }
  };
  const handleDelete = async (showtimeId) => {
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      try {
        await axiosPrivate.delete(`/show_times/${showtimeId}`);
        setShowTimes((prevShowTimes) =>
          prevShowTimes.filter((showtime) => showtime.id !== showtimeId)
        );
      } catch (error) {
        console.error("Error deleting showtime:", error);
      }
    }
  };
  return (
    <TheatreAdminLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-white mb-6">
          Showtimes for {theatre?.name}
        </h2>

        {/* Add New Showtime Form */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-300 mb-4">
            Add New Showtime
          </h3>
          <form
            onSubmit={handleAddShowTime}
            className="bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <label className="block text-gray-300 font-bold mb-2">
                Movie
              </label>
              <select
                name="movie_id"
                value={newShowTime.movie_id}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select a Movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 font-bold mb-2">
                Select Dates
              </label>
              <DatePicker
                multiple
                value={selectedDates}
                onChange={setSelectedDates}
                format="YYYY-MM-DD"
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 font-bold mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={newShowTime.start_time}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 font-bold mb-2">
                End Time
              </label>
              <input
                type="time"
                name="end_time"
                value={newShowTime.end_time}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Showtime
            </button>
          </form>
        </div>

        {/* Showtime List */}
        {showTimes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">
                    Movie Title
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">
                    Poster
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {showTimes.map((showtime) => (
                  <tr
                    key={showtime.id}
                    className="bg-gray-900 border-t border-gray-700 hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 text-gray-300">
                      {showtime.title}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(showtime.start_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(showtime.end_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <img
                        src={showtime.poster_url}
                        alt={showtime.title}
                        className="h-20 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(showtime.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-300">No showtimes available.</p>
        )}
      </div>
    </TheatreAdminLayout>
  );
};

export default ShowTimes;
