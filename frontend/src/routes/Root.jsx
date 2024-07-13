import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import MainLayout from '../components/LandingPage';
import LayoutAdmin from '../layouts/admin.jsx';
import LayoutUser from '../layouts/user.jsx'; // Asumiendo que tienes un layout para usuarios normales

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
    <>
      {user ? (
        <>
          {user.roles[0].name === 'admin' ? (
            <LayoutAdmin>
              <Outlet />
            </LayoutAdmin>
          ) : (
            <LayoutUser>
              <Outlet />
            </LayoutUser>
          )}
        </>
      ) : (
        <MainLayout />
      )}
    </>
  );
}

export default Root;
