import React from 'react';
import { Box } from '@mui/material';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AdminNavbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: '240px', // Make space for the drawer
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
