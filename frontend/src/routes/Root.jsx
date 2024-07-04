import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Header from '../components/Header';

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Header />
      <Box sx={{ padding: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Root;
