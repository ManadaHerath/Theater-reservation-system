import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Home from "./pages/Home";
import Movies from "./pages/MoviePage";
import Theatres from "./pages/TheatrePage";
import Schedule from "./pages/SchedulePage";


import React from "react";
import MovieList from "./components/Movies";
import Heading from "./components/Heading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TheatreList from "./components/Theatres";
import MovieShedule from "./components/Shedule";
import MoviePage from "./pages/MoviePage";


const App = () => {
  
  return(
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
          </Routes>
        <Footer />
      </Router>

    </div>
  )

}

export default App;