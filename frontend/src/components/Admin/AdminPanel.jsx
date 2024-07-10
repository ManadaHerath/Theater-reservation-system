import React from 'react';
import TheatreList from './Theatre/DeleteTheatreAdmin';

const AdminPanel = () => {
    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800">Admin Panel</h1>
            <TheatreList />
        </div>
    );
};


export default AdminPanel;