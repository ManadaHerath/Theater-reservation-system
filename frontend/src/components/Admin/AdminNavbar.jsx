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
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                overflowY: 'auto',
            }}
        >
            <Typography variant="h6" component="div" sx={{ marginBottom: 4, color: 'white' }}>
                Admin Dashboard
            </Typography>
            <Button
                component={NavLink}
                to="/admin"
                color="inherit"
                sx={{
                    color: 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&.active': { color: 'green' },
                    '&:hover': { color: 'green' },
                }}
            >
                Home
            </Button>
            <Button
                component={NavLink}
                to="/admin/manage-theatres"
                color="inherit"
                sx={{
                    color: 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&.active': { color: 'green' },
                    '&:hover': { color: 'green' },
                }}
            >
                Manage Theatres
            </Button>
            <Button
                component={NavLink}
                to="/admin/movies"
                color="inherit"
                sx={{
                    color: 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&.active': { color: 'green' },
                    '&:hover': { color: 'green' },
                }}
            >
                Manage Movies
            </Button>
            <Button
                component={NavLink}
                to="/admin/users"
                color="inherit"
                sx={{
                    color: 'white',
                    marginBottom: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&.active': { color: 'green' },
                    '&:hover': { color: 'green' },
                }}
            >
                Manage Users
            </Button>
        </Box>
    );
};

export default AdminNavbar;
