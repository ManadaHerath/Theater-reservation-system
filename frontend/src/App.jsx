import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/MoviePage";
import Theatres from "./pages/TheatrePage";
import Schedule from "./pages/SchedulePage";

import Help from "./pages/HelpPage";
import Terms from "./pages/TermsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";


import React from "react";
import ReactDOM from "react-dom/client";
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
import Reset from "./components/User Login/Reset";


import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import Layout from "./layout/layout";
import RequireAuth from "./components/RequireAuth";


const App = () => {
  return (
    <div>
      <Router>
        <Heading />
        <ConditionalNavBar />
        <Routes>
        <Route path = "/" element ={<Layout/>}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            
            <Route path="/schedule" element={<Schedule />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="/otp" element={<OTPInput />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />

            <Route path="/schedule/:paramId" element={<Schedule />} />
            <Route path="/reset" element={<Reset />}></Route>
            <Route
              path="/seat-selection/:showId/:theatreId"
              element={<SeatSelection />}
            />
            <Route path="/register" element={<RegisterPage />} />

            <Route element = {<RequireAuth/>}>
              <Route path="/theatres" element={<Theatres />} />
            </Route>


            <Route path="/payment-failure/:showId/:theatreId" element={<PaymentFailure />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/login" element={<LoginPage />} />


          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

const ConditionalNavBar = () => {
  const location = useLocation();
  const hideNavBarRoutes = [
    "/register",
    "/login",
    "/otp",
    "/forgot-password",
    "/reset",
    "/terms",
    "/privacyPolicy",
    "/help",
  ];

  return !hideNavBarRoutes.includes(location.pathname) ? <NavBar /> : null;
};

export default App;

