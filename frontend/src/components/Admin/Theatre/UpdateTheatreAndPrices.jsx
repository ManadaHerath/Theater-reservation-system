import { React, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const TheatreCard = ({ theatre, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleViewClick = () => {
    navigate(`/theatre/${theatre.id}`);
  };

  const handleUpdateClick = () => {
    navigate(`/admin/update-theatre/${theatre.id}`);
  };

  const handleSeatGrid = () => {
    navigate(`/admin/seatgrid/${theatre.id}`);
  };
  const handleChildrenPrices = () => {
    navigate(`/admin/specialprices/${theatre.id}`);
  };
  const handleDeleteClick = async () => {
    try {
      await axiosPrivate.delete(`/theatres/${theatre.id}`);
      onDelete(theatre.id);
    } catch (error) {
      console.error("Failed to delete theatre:", error);
    }
  };

  return (
    <div className="bg-black p-4 rounded-xl mx-1 my-3 w-80 h-auto shadow-xl transition-transform duration-300 hover:scale-105">
      <div
        className={`theatre-card bg-gray-400 p-4 rounded-xl relative ${
          theatre.is_active ? "" : "inactive"
        } cursor-pointer`}
        onClick={handleViewClick}
      >
        <div className="relative transition-opacity duration-300 hover:opacity-75">
          <img
            src={theatre.image_url}
            alt={theatre.name}
            className="object-cover w-full h-64 rounded-lg"
            onError={(e) =>
              (e.target.src =
                "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg")
            }
          />
        </div>

        <div className="theatre-details p-4">
          <h3 className="text-xl font-bold mb-2">{theatre.name}</h3>
          <p className="text-gray-800">{theatre.details}</p>
        </div>
      </div>
      <button
        onClick={handleUpdateClick}
        className="block mt-2 px-4 py-2 w-full bg-green-900 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out shadow-lg"
      >
        Update
      </button>
      <button
        onClick={handleSeatGrid}
        className="block mt-2 px-4 py-2 w-full bg-yellow-900 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-lg"
      >
        Add or Update Seat Structure
      </button>
      <button
        onClick={handleChildrenPrices}
        className="block mt-2 px-4 py-2 w-full bg-purple-900 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out shadow-lg"
      >
        Add Children Prices
      </button>
      <button
        onClick={handleDeleteClick}
        className="block mt-2 px-4 py-2 w-full bg-red-900 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-lg"
      >
        Delete
      </button>
    </div>
  );
};

const TheatreList = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/theatres");
        setData(response.data);
      } catch (error) {
        setError(error.message);
        navigate("/login", { state: { from: location }, replace: true });
      }
      setLoading(false);
    };

    fetchData();
  }, [axiosPrivate, location, navigate]);

  const handleDelete = (id) => {
    setData(data.filter((theatre) => theatre.id !== id));
  };

  const handleUpdate = (id) => {
    navigate(`/admin/update-theatre/${id}`);
  };

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

  if (loading) {
    return <GradientCircularProgress />;
  }

  if (error.length > 0) {
    console.log(error);
  }
  const theatresToShow = showAll ? data : data.slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 justify-center items-center sm:space-x-4">
        {theatresToShow.map((theatre) => (
          <TheatreCard
            key={theatre.id}
            theatre={theatre}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
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
  );
};

export default TheatreList;
