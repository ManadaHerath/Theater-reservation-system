import React from 'react';
import TheatreList from '../../components/Admin/Theatre/UpdateTheatreAndPrices';
import { useNavigate } from "react-router-dom";

const ManageTheatres = () => {
    const navigate = useNavigate();

    const handleAddTheatreClick = () => {
        navigate(`/admin/add-theatre`);
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Manage Theatres</h1>
            <button
                onClick={handleAddTheatreClick}
                className="mt-4 text-sm md:text-base bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
            >
                Add Theatre
            </button>
            <div className="mt-6">
                <TheatreList />
            </div>
        </div>
    );
};

export default ManageTheatres;
