import React from 'react';
import TheatreList from './Theatre/UpdateTheatreAndPrices';
import { useNavigate } from "react-router-dom";
import AdminLayout from './AdminLayout';

const AdminPanel = () => {
    const navigate = useNavigate();

    const handleAddTheatreClick = () => {
        navigate(`/admin/manage-theatres`);
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-semibold text-gray-800">Manage Theatres</h1>
            <button
                onClick={handleAddTheatreClick}
                className="mt-4 text-green-600 hover:underline"
            >
                Add Theatre
            </button>
            <TheatreList />
        </AdminLayout>
    );
};

export default AdminPanel;
