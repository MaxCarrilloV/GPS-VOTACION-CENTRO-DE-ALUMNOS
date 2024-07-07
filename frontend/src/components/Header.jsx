import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/auth.service';

function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'blue.500' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de votación de centros de alumnos
        </Typography>
        {user && (
          <Box display="flex" alignItems="center">
            <Typography sx={{ marginRight: 2 }}>
              Estás logeado como: {user.email}
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
