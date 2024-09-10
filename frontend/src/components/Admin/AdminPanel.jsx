
import React from "react";
import TheatreList from "./Theatre/UpdateTheatreAndPrices";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleAddTheatreClick = () => {
    navigate(`/admin/add-theatre`);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold text-white pb-5">Admin Panel</h1>
      <TheatreList />

      <button
        onClick={handleAddTheatreClick}
        className="bg-blue-400 px-5 py-2 rounded-xl text-white hover:bg-blue-700 mt-5 "
      >
        Add Theatre
      </button>
    </AdminLayout>
  );

};

export default AdminPanel;
