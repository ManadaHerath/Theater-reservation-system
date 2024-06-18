import React from "react";
import MovieList from "./components/Movies";
import Heading from "./components/Heading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TheatreList from "./components/Theatres";

const App = () => {
  
  return(
    <div>
      <Heading />
      <NavBar />
      <MovieList />
      <TheatreList/>
      <Footer />
    </div>
  )

}

export default App;