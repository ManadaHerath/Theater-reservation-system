import React, { useReducer, useEffect, useRef } from "react";
import "./MovieSlideshow.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const slidesReducer = (state, event) => {
  if (event.type === "NEXT") {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % state.movies.length,
    };
  }
  if (event.type === "PREV") {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0 ? state.movies.length - 1 : state.slideIndex - 1,
    };
  }
};

function useTilt(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !active) {
      return;
    }

    const state = {
      rect: undefined,
      mouseX: undefined,
      mouseY: undefined,
    };

    let el = ref.current;

    const handleMouseMove = (e) => {
      if (!el) return;

      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty("--px", px);
      el.style.setProperty("--py", py);
    };

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  return ref;
}

function Slide({ movie, offset, handleClick, isActive }) {
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);

  return (
    <div
      ref={ref}
      className="slide"
      data-active={active}
      style={{
        "--offset": offset,
        "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1,
      }}
      onClick={() => handleClick(movie)}
    >
      <div
        className={`slideBackground ${isActive ? "active-background" : ""}`}
        style={{
          backgroundImage: `url('${movie.cover_photo}')`,
        }}
      />
      <div
        className="slideContent cursor-pointer"
        style={{
          backgroundImage: `url('${movie.cover_photo}')`,
        }}
      ></div>
    </div>
  );
}

function MovieSlideshow({ movies }) {
  const initialState = {
    slideIndex: 0,
    movies,
  };

  const [state, dispatch] = useReducer(slidesReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "NEXT" });
    }, 20000);

    return () => clearInterval(intervalId);
  }, [state.slideIndex]);

  const handleClick = (movie) => {
    navigate(`/movie/${movie.id}`); // Navigate to the movie details page with the movie ID
  };

  const handleUrlClick = () => {
    window.open(activeMovie.trailer_video_url, "_blank");
  };

  const handleBookTicketClick = () => {
    navigate(`/schedule/m${activeMovie.id}`);
  };

  const activeMovie = state.movies[state.slideIndex];

  return (
    <>
      <div className="relative homepage-front-view">
        <img
          className="front-image"
          src={activeMovie.cover_photo}
          alt={activeMovie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,1)]  to-transparent"></div>
        <h1 className="absolute z-20 text-white lg:text-8xl text-3xl md:text-6xl lg:bottom-40 bottom-[105px] md:left-20 left-4 cursor-default">
          {activeMovie.title}
        </h1>
        <div className="absolute flex gap-6 lg:bottom-20 bottom-[50px] md:left-20 left-4">
          <button onClick={handleBookTicketClick} className="block lg:px-6 lg:py-3 px-2 py-1 lg:text-2xl text-lg text-left  text-white bg-transparent border rounded-2xl  hover:text-black hover:bg-white font-semibold">
            Buy
            
            Tickets
          </button>
          <button
            className="block lg:px-6 lg:py-3 px-3 py-2 lg:text-2xl text-lg text-left text-white bg-transparent border rounded-2xl  hover:text-black hover:bg-white font-semibold"
            onClick={handleUrlClick}
          >
            Watch
           
            Trailer
          </button>
        </div>

        <div className="items-center text-white side-bar cursor-default lg:block hidden ">
          <h1
            className="w-full font-bold text-center text-7xl"
            style={{ paddingTop: "15vh" }}
          >
            B
          </h1>
          <h1 className="w-full font-bold text-center text-7xl">O</h1>
          <h1 className="w-full font-bold text-center text-7xl">O</h1>
          <h1 className="w-full font-bold text-center text-7xl">K</h1>
          <h1 className="w-full text-4xl font-bold text-center">Your</h1>
          <h1 className="w-full text-4xl font-bold text-center">Seats</h1>
          <h1 className="w-full text-5xl font-bold text-center">Now</h1>
        </div>
      </div>

      <div className="relative lg:pt-16 pt-8 movie-slider-container">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,1)]  to-transparent"></div>

        <h1 className="absolute top-0 flex pt-3 pr-20 font-bold lg:text-3xl text-xl text-white md:right-24 right-20">
          Now Showing
        </h1>

        <div className="absolute top-0 right-0 flex gap-4 pt-3 pr-20 ">
          <button
            onClick={() => dispatch({ type: "PREV" })}
            className="px-2 py-2 pt-2 text-white lg:text-2xl hover:bg-blue-500 rounded-3xl"
          >
            <FontAwesomeIcon icon={faChevronLeft}/>
          </button>
          <button
            onClick={() => dispatch({ type: "NEXT" })}
            className="px-2 py-2 pt-2 text-white lg:text-2xl hover:bg-blue-500 rounded-3xl "
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className="slider-wrapper">
          <div className="slides">
            <button
              onClick={() => dispatch({ type: "PREV" })}
              className="absolute left-0 transform -translate-y-1/2 top-1/2"
            >
              ‹
            </button>

            {[...Array(3)].map((_, i) => {
              const index =
                (state.slideIndex + i - 1 + state.movies.length) %
                state.movies.length;
              return (
                <Slide
                  movie={state.movies[index]}
                  offset={i - 1}
                  key={index}
                  handleClick={handleClick}
                  isActive={i === 1}
                />
              );
            })}

            <button
              onClick={() => dispatch({ type: "NEXT" })}
              className="absolute right-0 transform -translate-y-1/2 top-1/2"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieSlideshow;
