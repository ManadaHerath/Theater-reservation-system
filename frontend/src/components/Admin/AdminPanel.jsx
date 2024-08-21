import React from 'react';
import TheatreList from './Theatre/UpdateTheatreAndPrices';
import {useNavigate} from "react-router-dom";



const AdminPanel = () => {
    const navigate = useNavigate();


    const handleAddTheatreClick = ()=>{
    
        navigate(`/admin/add-theatre`);
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800">Admin Panel</h1>
            <button
                onClick={handleAddTheatreClick}
                className="block mt-2 text-green-600 hover:underline"
                >
                Add Theatre
            </button>
            <TheatreList />
        </div>
    );
};


export default AdminPanel;