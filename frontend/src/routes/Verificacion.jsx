import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VerificacionForm from '../components/VerificacionForm.jsx';

function Login() {
  const navigate = useNavigate();

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
        <VerificacionForm />
      </Box>
    </>
  );
}

export default Login;
