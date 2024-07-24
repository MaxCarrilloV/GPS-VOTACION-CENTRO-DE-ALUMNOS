import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
          onClick={() => navigate('/foro')}
        >
          Ir a home
        </Button>
      </Box>
    );
  }

  return (
    <>
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C6AA0',
        position: 'relative',
        flexDirection: 'column',
      }}
      >
        <LoginForm />
      </Box>
    </>
  );
}

export default Login;
