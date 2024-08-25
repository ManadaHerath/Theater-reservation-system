import React, { useReducer, useEffect, useRef } from "react";
import "./MovieSlideshow.css";
import { useNavigate } from "react-router-dom";
import testpicture from './test.jpg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons'


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
          backgroundImage: `url('${movie.poster_url}')`,
        }}
      />
      <div
        className="slideContent"
        style={{
          backgroundImage: `url('${movie.cover_poster}')`,
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
  const activeMovie = state.movies[state.slideIndex];

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "NEXT" });
    }, 40000);

    return () => clearInterval(intervalId);
  }, [state.slideIndex]);

  const handleClick = (movie) => {
    navigate(`/movie/${movie.id}`); // Navigate to the movie details page with the movie ID
  };

  const handleUrlClick = () => {
    window.open(activeMovie.trailer_video_url, '_blank');
  }


  

  return (
    <>
      <div className="relative homepage-front-view">

        <img className="relative front-image" src={activeMovie.cover_poster} alt={activeMovie.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,1)]  to-transparent"></div>
        

        
        <h1 className="absolute z-20 text-white text-8xl bottom-40 left-20">
          {activeMovie.title}
        </h1>
        <div className="absolute flex gap-10 bottom-10 left-20">
          <button className="block px-6 py-3 text-2xl text-left text-white bg-transparent border-none hover:text-blue-700">
            Buy<br/>Tickets
          </button>
          <button className="block px-6 py-3 text-2xl text-left text-white bg-transparent border-none hover:text-blue-700" onClick={handleUrlClick}>
            Watch<br/>Trailer 
          </button>
        </div>


        <div className="items-center text-white side-bar">
          <h1 className="w-full font-bold text-center text-7xl" style={{ paddingTop: '15vh' }}>B</h1>
          <h1 className="w-full font-bold text-center text-7xl" >O</h1>
          <h1 className="w-full font-bold text-center text-7xl" >O</h1>
          <h1 className="w-full font-bold text-center text-7xl" >K</h1>
          <h1 className="w-full text-4xl font-bold text-center">Your</h1>
          <h1 className="w-full text-4xl font-bold text-center">Seats</h1>
          <h1 className="w-full text-5xl font-bold text-center">Now</h1>
        </div>

        
      </div>


      <div className="relative pt-8 movie-slider-container">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,1)]  to-transparent"></div>

        <h1 className="absolute top-0 flex pt-4 pr-20 text-3xl text-white right-20">
          Now Showing
        </h1>
        
        <div className="absolute top-0 right-0 flex gap-4 pt-4 pr-20">
          <button
            onClick={() => dispatch({ type: "PREV" })}
            className="px-2 py-1 pt-2 text-white text-x4"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={() => dispatch({ type: "NEXT" })}
            className="px-2 py-1 pt-2 text-white text-x4"
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
