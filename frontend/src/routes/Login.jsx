import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import LoginForm from '../components/LoginForm';

function Login() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    return (
      <Box sx={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'black' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          ¡Hola, {user.email}! Ya estás logueado.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Ir a home
        </Button>
      </Box>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoginForm />
    </div>
  );
}

export default Login;
