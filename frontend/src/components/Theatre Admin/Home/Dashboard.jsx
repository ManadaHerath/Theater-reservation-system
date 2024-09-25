import React, { useEffect, useState } from "react";
import TheatreAdminLayout from "../TheatreAdminLayout";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import BasicPieChart from "../../Admin/Dashboard/PieChart";

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [theatre, setTheatre] = useState([]);
  const [purchasedMovieData, setPurchasedMovieData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheatre = async () => {
      try {
        const response = await axiosPrivate.get("theatre-admin/theatre");
        setTheatre(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching theatre:", error);
      }
    };
    fetchTheatre();
  }, []);

  useEffect(() => {
    const fetchMoiviesByTheatre = async () => {
      try {
        const response = await axiosPrivate.get(
          `theatre-admin/theatre/${theatre.id}`
        );
        setPurchasedMovieData(response.data);
      } catch (error) {
        console.error("Error fetching movies by theatre:", error);
      }
    };
    fetchMoiviesByTheatre();
  }, [theatre]);

  return (
    <TheatreAdminLayout>
      <div className="flex justify-center flex-col items-center text-xl md:text-2xl lg:text-3xl text-white font-bold">
        <h1 className="p-6">{theatre.name}</h1>
        <h1 className="text-base md:text-xl lg:text-2xl pb-5">
          Ticket Purchases in Last Two Months
        </h1>
        <BasicPieChart data={purchasedMovieData} />
      </div>
    </TheatreAdminLayout>
  );
}
