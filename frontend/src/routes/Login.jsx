import { Box, Link, Typography } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  if (localStorage.getItem('user')) {
    return (
      <>
        <h2>Ya estas logeado!</h2>
        <button onClick={() => navigate('/')}>Ir a home</button>
      </>
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
        padding: '20px',
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
