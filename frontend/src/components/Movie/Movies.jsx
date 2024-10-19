import React,{  useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
const MovieCard = ({ movie }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleMovieViewClick = () => {
    navigate(`/movie/${movie.id}`); // Navigate to the Movie details page
  };

  const handleClick = () => {
    navigate(`/schedule/m${movie.id}`); // Navigate to the schedule page
  };

  const handleUrlClick = () => {
    window.open(movie.trailer_video_url, "_blank");
  };

  return (
    <div
      className="group relative w-80 h-96 cursor-pointer bg-gray-900 rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 mt-5"
      onClick={handleMovieViewClick}
    >
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover transform transition-opacity duration-300 group-hover:opacity-80"
          src={movie.poster_url}
          alt={`${movie.title} Poster`}
          onError={(e) => {
            e.target.src =
              "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <div className="hidden group-hover:block text-gray-300 text-sm line-clamp-3">
          {movie.overview}
          <p>Released: {new Date(movie.released_date).toDateString()}</p>
          <p>Duration: {movie.duration}</p>
          <p>Language: {movie.original_language}</p>
          <p>Rating: {movie.rating}</p>
        </div>
        <div className="flex justify-between mt-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 rounded-full text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleUrlClick}
          >
            Watch Trailer
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 rounded-full text-sm focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleClick}
          >
            Buy Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

const MovieList = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        const response = await axiosPrivate.get("/movies");
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
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
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);

    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  const filteredMovies = data.filter((movie) =>
    movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "60%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "30%",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GradientCircularProgress/> {/* Loading spinner */}
      </div>
    );
  }

  if (error.length > 0) {
    console.log(error);
  }

  return (
    <div className="py-16 mb-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#09081d", // Adjust to your preferred background color
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
              value: 90, // Number of particles
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
          detectRetina: true, // High-resolution rendering support
        }}
      />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#111827" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 5,
                marginLeft: {
                  xs: 2,
                  sm: 10,
                },
              }}
            >
              Movies
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                autoFocus
                type="text"
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearch}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mx-auto">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p className="text-white">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
