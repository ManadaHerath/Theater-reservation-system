import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MovieList from "./components/Movies";
import Heading from "./components/Heading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TheatreList from "./components/Theatres";
import RegisterForm from "./components/User Registration/Register";

const App = () => {
  return (
    <div className="bg-black">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <MovieList />
                <TheatreList />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div>
                <RegisterForm />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
