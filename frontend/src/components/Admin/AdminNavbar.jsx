import React from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const AdminNavbar = () => {
    return (
        <Box
            sx={{
                width: 250,
                height: '100vh',
                backgroundColor: '#2d2d2d',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            <Typography variant="h6" component="div" sx={{ marginBottom: 4, color: 'white' }}>
                Admin Dashboard
            </Typography>
            <Button
                component={NavLink}
                to="/admin"
                color="inherit"
                sx={({ isActive }) => ({
                    color: isActive ? 'green' : 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'green' },
                })}
            >
                Home
            </Button>
            <Button
                component={NavLink}
                to="/admin/add-theatre"
                color="inherit"
                sx={({ isActive }) => ({
                    color: isActive ? 'green' : 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'green' },
                })}
            >
                Manage Theatres
            </Button>
            <Button
                component={NavLink}
                to="/admin/movies"
                color="inherit"
                sx={({ isActive }) => ({
                    color: isActive ? 'green' : 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'green' },
                })}
            >
                Manage Movies
            </Button>
            <Button
                component={NavLink}
                to="/admin/users"
                color="inherit"
                sx={({ isActive }) => ({
                    color: isActive ? 'green' : 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'green' },
                })}
            >
                Manage Users
            </Button>
        </Box>
    );
};

export default AdminNavbar;
