import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManageTheatres from '../../pages/Admin/Admin-Theatre'; // Import the component for managing theatres
import AdminLayout from './AdminLayout'; // You can keep this for consistent layout

const AdminPanel = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="manage-theatres" element={<ManageTheatres />} />
                {/* Add other routes for other admin sections here */}
            </Routes>
        </AdminLayout>
    );
};

export default AdminPanel;
