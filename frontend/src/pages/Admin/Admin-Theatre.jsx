import React from "react";
import TheatreList from "../../components/Admin/Theatre/UpdateTheatreAndPrices";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";

const ManageTheatres = () => {
  const navigate = useNavigate();

  const handleAddTheatreClick = () => {
    navigate(`/admin/add-theatre`);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Manage Theatres
        </h1>
        <button
          onClick={handleAddTheatreClick}
          className="mt-4 text-sm md:text-base bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-all"
        >
          Add Theatre
        </button>
        <div className="mt-6">
          <TheatreList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageTheatres;
