import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TheatreAdminLayout from "../TheatreAdminLayout";

const ShowTimes = () => {
  const [theatre, setTheatre] = useState(null);
  const [showTimes, setShowTimes] = useState([]);
  const [movies, setMovies] = useState([]); // Store the list of movies
  const [newShowTime, setNewShowTime] = useState({
    movie_id: "",
    start_time: "",
    end_time: ""
  });
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
      await axiosPrivate.post("/show_times", {
        theatre_id: theatre.id,
        ...newShowTime,
      });
      // After successful add, reload showtimes
      const updatedShowTimes = await axiosPrivate.get(
        `show_times/theatre/${theatre.id}`
      );
      setShowTimes(updatedShowTimes.data);
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
                Start Time
              </label>
              <input
                type="datetime-local"
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
                type="datetime-local"
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
                    <td className="px-6 py-4">
                      <img
                        src={showtime.poster_url}
                        alt={showtime.title}
                        className="w-24 h-36 object-cover rounded-lg shadow-md"
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
          <p className="text-gray-400">No showtimes available for this theatre.</p>
        )}
      </div>
    </TheatreAdminLayout>
  );
};

export default ShowTimes;
