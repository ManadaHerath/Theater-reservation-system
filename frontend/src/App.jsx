import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/MoviePage";
import Theatres from "./pages/TheatrePage";
import Schedule from "./pages/SchedulePage";

import Help from "./pages/HelpPage";
import Terms from "./pages/TermsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import React from "react";
import ReactDOM from "react-dom";
import MovieList from "./components/Movies";
import Heading from "./components/Heading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TheatreList from "./components/Theatres";
import MovieShedule from "./components/Shedule";
import MoviePage from "./pages/MoviePage";
import SeatSelection from "./components/SeatSelection";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Forgotpassword from "./components/User Login/Forgotpassword";
import OTPInput from "./components/User Login/OTPInput";

const App = () => {
  return (
    <div>
      <Router>
        <Heading />
        <NavBar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/theatres" element={<Theatres />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="forgot-password" element={<Forgotpassword />} />
          <Route path="/otp" element={<OTPInput />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/schedule/:paramId" element={<Schedule />} />
          <Route
            path="/seat-selection/:showId/:theatreId"
            element={<SeatSelection />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
