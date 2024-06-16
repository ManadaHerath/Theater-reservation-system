import React from "react";
import MovieList from "./components/Movies";
import Heading from "./components/Heading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


const App = () => {
  
  return(
    <div>
      <Heading />
      <NavBar />
      <MovieList />
      <Footer />
    </div>
  )

}

export default App;