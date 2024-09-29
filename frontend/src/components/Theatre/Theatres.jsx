// TheatreList.jsx
import { React, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SearchBar from "./Searchbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const TheatreCard = (props) => {
  return (
    <div>
      <div
        className={`theatre-card w-80 h-auto relative overflow-hidden transition-transform duration-300 hover:scale-105 ${
          props.is_active ? "" : "inactive"
        }`}
      >
        <div className="relative transition-opacity duration-300 hover:opacity-75 rounded-xl mt-4 w-80 h-96">
          <Link to={`/theatre/${props.id}`}>
            <img
              src={props.image_url}
              alt={props.name}
              className="object-cover w-full h-full rounded-xl"
              onError={(e) =>
                (e.target.src =
                  "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg")
              }
            />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-gray-900 to-transparent cursor-pointer group-hover:opacity-50">
          <h3 className="text-xl font-bold mb-2 text-white">{props.name}</h3>
          <p className="text-white font-thin">{props.details}</p>
        </div>
      </div>
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
  const [searchTerm, setSearchTerm] = useState("");

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/theatres");
        setData(response.data);
      } catch (error) {
        setError(error.message);
        navigate("/login", { state: { from: location }, replace: true });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error.length > 0) {
    console.log(error);
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredTheatres = data.filter((theatre) =>
    theatre.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Determine the number of cards to show
  const theatresToShow = showAll
    ? filteredTheatres
    : filteredTheatres.slice(0, 8);

  return (
    <div className="py-16 mb-10">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 5, marginLeft: 10 }}
            >
              Theatres
            </Typography>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          </Toolbar>
        </AppBar>
      </Box>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mx-auto">
        {theatresToShow.length > 0 ? (
          theatresToShow.map((theatre) => (
            <TheatreCard
              key={theatre.id}
              id={theatre.id}
              name={theatre.name}
              details={theatre.details}
              image_url={theatre.image_url}
              is_active={theatre.is_active}
            />
          ))
        ) : (
          <p className="text-white">No theatres found.</p>
        )}
      </div>

      {!showAll && filteredTheatres.length > 8 && (
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
