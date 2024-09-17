import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Chart from "./Chart";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { set } from "date-fns";

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [registrationsCount, setRegistrationsCount] = useState([]);
  const [purchasedTicketsCount, setPurchasedTicketsCount] = useState([]);
  const [purchasedTicketsDate, setPurchasedTicketsDate] = useState([]);
  const [registrationDates, setRegistrationDates] = useState([]);
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

  return (
    <AdminLayout>
      <div className="mt-4 mb-2 mx-auto grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-3xl py-2 font-semibold mb-2">
            Deveation of Registered Users
          </h1>

          <Chart
            xAxis={registrationDates}
            series={registrationsCount}
            colour={"blue"}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-3xl py-2 font-semibold">
            Deveation of Purchased Tickets
          </h1>

          <Chart
            xAxis={purchasedTicketsDate}
            series={purchasedTicketsCount}
            colour={"green"}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
