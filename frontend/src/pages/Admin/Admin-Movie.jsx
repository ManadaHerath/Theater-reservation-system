import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AdminLayout from "../../components/Admin/AdminLayout";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const MovieCard = ({ movie }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate(); // Hook for navigation
  const [open, setOpen] = React.useState(false);

  const handleViewClick = () => {
    navigate(`/movie/${movie.id}`); // Navigate to the schedule page
  };
  const handleUpdateClick = () => {
    navigate(`/admin/update-movie/${movie.id}`);
  };
  const handleDeleteClickOpen = () => {
    setOpen(true);
  };
  const handleDeleteClickClose = () => {
    setOpen(false);
  };
  const handleDeleteClickOkay = async () => {
    try {
      await axiosPrivate.delete(`http://localhost:5001/movies/${movie.id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <div className="group relative p-4 w-72 m-4 cursor-pointer h-96 bg-gray-100 rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105">
        <div className="absolute inset-0" onClick={handleViewClick}>
          <img
            className="w-full h-full object-cover transform transition-opacity duration-300 group-hover:opacity-80"
            src={movie.poster_url}
            onClick={handleViewClick}
            alt={`${movie.title} Poster`}
            onError={(e) => {
              e.target.src =
                "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>

        {/* Card Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent group-hover:opacity-100 transition-all duration-300">
          <div
            className="hidden group-hover:block text-gray-300 text-sm line-clamp-3"
            onClick={handleViewClick}
          >
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {movie.title}
            </h3>
            {movie.overview}
            <p>Released: {new Date(movie.released_date).toDateString()}</p>
            <p>Duration: {movie.duration}</p>
            <p>Language: {movie.original_language}</p>
            <p>Rating: {movie.rating}</p>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-xl text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleUpdateClick}
            >
              Update Movie
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded-xl text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleDeleteClickOpen}
            >
              Delete Movie
            </button>
            {/* <button
              className="bg-violet-500 hover:bg-violet-700 text-white py-1 px-1 rounded-xl text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleViewClick}
            >
              View More
            </button> */}
          </div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDeleteClickClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Are You Sure to Delete This?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                This will delete the movie permanently.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClickClose}>Cancel</Button>
              <Button onClick={handleDeleteClickOkay}>Okay</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </React.Fragment>
  );
};

export default function AdminMovie() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
    return <GradientCircularProgress />;
  }

  if (error.length > 0) {
    console.log(error);
  }
  const moviesToShow = showAll ? data : data.slice(0, 8);

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Manage Movies
        </h1>
        <button
          onClick={() => {
            navigate("/admin/add-new-movie");
          }}
          className="mt-4 text-sm md:text-base bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-all"
        >
          Add New Movie
        </button>
        <div className="mt-8 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 justify-center items-center sm:space-x-4">
          {moviesToShow.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {!showAll && data.length > 8 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-10"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
