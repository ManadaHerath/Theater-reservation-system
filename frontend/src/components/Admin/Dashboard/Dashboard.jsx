import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Chart from "./Chart";
import BasicPieChart from "./PieChart";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import axios from "../../../api/axios";
import Grid from "./Grid";
export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [registrationsCount, setRegistrationsCount] = useState([]);
  const [purchasedTicketsCount, setPurchasedTicketsCount] = useState([]);
  const [purchasedTicketsDate, setPurchasedTicketsDate] = useState([]);
  const [registrationDates, setRegistrationDates] = useState([]);
  const [ticketPurchasedDataByMovie, setTicketPurchasedDataByMovie] = useState(
    []
  );
  const [ticketPurchasedDataByTheatre, setTicketPurchasedDataByTheatre] =
    useState([]);

  const [movieData, setMovieData] = useState([]);
  const [theatreData, setTheatreData] = useState([]);
  useEffect(() => {
    axiosPrivate
      .get("/admin-dash/registrations")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosPrivate.get("/admin-dash/purchased-tickets").then((res) => {
      setPurchasedTicketsCount(res.data.map((item) => item.purchased_count));
      setPurchasedTicketsDate(res.data.map((item) => item.purchased_date));
    });
    axiosPrivate.get("/admin-dash/tickets-based-movie").then((res) => {
      setTicketPurchasedDataByMovie(res.data);
    });
    axiosPrivate.get("/admin-dash/tickets-based-theatre").then((res) => {
      setTicketPurchasedDataByTheatre(res.data);
    });

    

    axios.get("/movies").then((res) => {
      setMovieData(res.data);
    });
    axios.get("/theatres").then((res) => {
      setTheatreData(res.data);
    });
  }, []);

  useEffect(() => {
    getRegistrationsCount();
  }, [data]);
  const getRegistrationsCount = () => {
    const registrationDates = data.map((item) => item.registered_date);
    const registration_Count = data.map((item) => item.registration_count);
    setRegistrationsCount(registration_Count);
    setRegistrationDates(registrationDates);
  };

  const removeFields = (data, fieldsToRemove) => {
    return data.map((item) => {
      const newItem = { ...item };
      fieldsToRemove.forEach((field) => {
        delete newItem[field];
      });
      return newItem;
    });
  };

  return (
    <AdminLayout>
      <div className="mt-4 mx-auto grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-2xl py-2 font-semibold mb-2">
            Deviation of User Registrations Over the Last 2 Weeks
          </h1>

          <Chart
            xAxis={registrationDates}
            series={registrationsCount}
            colour={"blue"}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-2xl py-2 font-semibold">
            Deviation of Purchased Tickets Over the Last 2 Weeks
          </h1>

          <Chart
            xAxis={purchasedTicketsDate}
            series={purchasedTicketsCount}
            colour={"green"}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-2xl py-2 font-semibold">
            Tickets Sold at Each Theatre Over the Last 2 Months
          </h1>
          <BasicPieChart data={ticketPurchasedDataByTheatre} />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-2xl py-2 font-semibold">
            Tickets Sold for Each Movie Over the Last 2 Months
          </h1>
          <BasicPieChart data={ticketPurchasedDataByMovie} />
        </div>
      </div>
      <div>
        <h1 className="text-white text-2xl md:text-4xl py-2 mt-5 font-bold ml-16 mb-5">
          Recently Added Movies
        </h1>
        <Grid movies={removeFields(movieData, [
            "trailer_video_url",
            "poster_url",
            "age_type",
            "is_active",
            "cover_photo",
            "image_url",
          ])} />
      </div>
      <div>
        <h1 className="text-white text-2xl md:text-4xl py-2 mt-5 font-bold ml-16 mb-5">
          Recently Added Theatres
        </h1>
        <Grid
          movies={removeFields(theatreData, [
            "location",
            "is_active",
            "no_of_seats",
            "no_of_rows",
            "no_of_columns",
            "image_url",
          ])}
        />
      </div>
    </AdminLayout>
  );
}
