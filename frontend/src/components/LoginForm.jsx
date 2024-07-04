import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CssBaseline,
  Avatar,
} from '@mui/material';

function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data).then(() => {
      navigate('/');
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 96 960 960"
            width="24"
            fill="white"
          >
            <path d="M480 606q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41zm-165 270q-24 0-45-9.5T244 838q-18-18-27.5-39.5T207 753q0-58 36-103t93-59q28-9 55-13.5t54-4.5q28 0 55 4.5t54 13.5q57 16 93 59t36 103q0 24-9.5 45.5T716 838q-18 18-39.5 27.5T631 875H315z" />
          </svg>
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            type="email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            {...register('email', { required: 'Este campo es requerido' })}
          />
          <TextField
            fullWidth
            id="password"
            label="Contraseña"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            {...register('password', { required: 'Este campo es requerido' })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginForm;

