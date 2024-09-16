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
import Unauthorized from "./components/Unauthorized";
import Help from "./pages/HelpPage";
import Terms from "./pages/TermsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Footer from "./components/Footer";
import React from "react";

import Heading from "./components/Heading";

import SeatSelection from "./components/SeatSelection";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Forgotpassword from "./components/User Login/Forgotpassword";
import OTPInput from "./components/User Login/OTPInput";
import Reset from "./components/User Login/Reset";

import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";

import TheatreDetails from "./pages/TheatreDetailsPage";
import MovieDetails from "./pages/MovieDetailsPage";

import Layout from "./layout/layout";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/Persist Login/PersistLogin";

// Admin Panel
import SeatGrid from "./components/Admin/SeatGrid/SeatGrid";
import AdminPanel from "./components/Admin/AdminPanel";
import AddTheatreForm from "./components/Admin/Theatre/AddTheatreAdmin";
import UpdateTheatreAdmin from "./components/Admin/Theatre/UpdateTheatreAdmin";
import PriceCategoriesChange from "./components/Admin/Theatre/PriceCategoriesChange";
import ManageTheatres from "./pages/Admin/Admin-Theatre";
import AddNewMovie from "./components/Admin/Movies/AddNewMovie";
import UpdateMovie from "./components/Admin/Movies/UpdateMovie";
import AdminMovie from "./pages/Admin/Admin-Movie";

// chatbot
import Chatbot from "../src/components/ChatBot";

import RequestRefund from "./pages/RequestRefund";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/unauthorized" element={<Unauthorized />}></Route>
            <Route path="/schedule" element={<Schedule />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="/otp" element={<OTPInput />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/theatre/:id" element={<TheatreDetails />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            <Route path="/schedule/:paramId" element={<Schedule />} />
            <Route path="/reset" element={<Reset />}></Route>
            <Route
              path="/seat-selection/:showId/:theatreId"
              element={<SeatSelection />}
            />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PersistLogin />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/theatres" element={<Theatres />} />
              <Route path="/refund/:token" element={<RequestRefund />}></Route>

              <Route element={<RequireAuth allowedRoles={["admin"]} />}>

                <Route
                  path="/admin/update-theatre/:id"
                  element={<UpdateTheatreAdmin />}
                ></Route>
                <Route
                  path="/admin/seatgrid"
                  element={<SeatGrid />}
                ></Route>
                <Route
                  path="/admin/add-theatre"
                  element={<AddTheatreForm />}
                ></Route>
                <Route
                  path="/admin/manage-theatres"
                  element={<ManageTheatres />}
                ></Route>
                <Route
                  path="/admin/price-categories/:id"
                  element={<PriceCategoriesChange />}
                ></Route>

                <Route path="/admin/add-new-movie" element={<AddNewMovie />} />
                <Route
                  path="/admin/update-movie/:id"
                  element={<UpdateMovie />}
                />
                <Route path="/admin/movie" element={<AdminMovie />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Route>

            <Route
              path="/payment-failure/:showId/:theatreId"
              element={<PaymentFailure />}
            />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
        <Chatbot chatbotId={"nfGTj217gv4zsYzJ5dct2"} />
        <ConditionalLayout />
      </Router>
    </div>
  );
};

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Footer />}
      {children}
    </>
  );
};

export default App;
