import { Box } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

function Register() {
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
        <RegisterForm />
      </Box>
    </>
    );
}

export default Register;
