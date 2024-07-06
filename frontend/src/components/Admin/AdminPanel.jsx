import React from 'react';
import AddTheatre from './TheatreAdmin';

const AdminPanel = () => {
    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800">Admin Panel</h1>
            <AddTheatre />
        </div>
    );
};


export default AdminPanel;