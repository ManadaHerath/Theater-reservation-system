import React from "react";
import ReactDOM from "react-dom";

import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MovieList from "./components/Movies";
import Heading from "./components/Heading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TheatreList from "./components/Theatres";
import RegisterForm from "./components/User Registration/Register";
import MovieShedule from "./components/Shedule";
import MoviePage from "./pages/MoviePage";
import SeatSelection from "./components/SeatSelection";
import Home from "./pages/Home";
import Movies from "./pages/MoviePage";
import Theatres from "./pages/TheatrePage";
import Schedule from "./pages/SchedulePage";

const App = () => {
  return (
    <div>
      <Router>
        <Heading />
        <NavBar />
        <Routes>
          <Route index element ={<Home/>}/>
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/theatres" element={<Theatres />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule/:paramId" element={<Schedule/>} />
          <Route path="/seat-selection/:showId/:theatreId" element={<SeatSelection/>} />
          <Route path="/register" element={<RegisterForm />} /> 
          </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
