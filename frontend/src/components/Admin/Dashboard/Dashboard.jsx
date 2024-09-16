import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Chart from "./Chart";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [registrationsCount, setRegistrationsCount] = useState([]);
  const [purchasedTicketsCount, setPurchasedTicketsCount] = useState([]);
  const [dates, setDates] = useState([]);
  useEffect(() => {
    axiosPrivate
      .get("/admin-dash/registrations")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getRegistrationsCount();
  }, [data]);
  const getRegistrationsCount = () => {
    const dates = data.map((item) => item.registered_date);
    const count = data.map((item) => item.registration_count);
    setRegistrationsCount(count);
    setDates(dates);
    console.log(dates);
  };

  return (
    <AdminLayout>
      <div className="mt-4 mb-2 mx-auto grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-3xl py-2 font-semibold mb-2">
            Deveation of Registered Users
          </h1>

          <Chart xAxis={dates} series={registrationsCount} colour={"blue"} />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xl md:text-3xl py-2 font-semibold">
            Deveation of Purchased Tickets
          </h1>

          <Chart
            xAxis={[1, 2, 3, 5, 8, 10]}
            series={[2, 5.5, 2, 8.5, 1.5, 5]}
            colour={"green"}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
