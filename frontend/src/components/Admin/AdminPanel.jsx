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
      
    </AdminLayout>
  );
};

export default AdminPanel;
