import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { login } from '../services/auth.service';
import { useState } from 'react';

function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = (data) => {
    login(data).then(() => {
      navigate('/foro'); //foro es página principal
    })
    .catch((error) => {
      setError(error.message);
    });
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '40%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <img
        src="https://intranet.ubiobio.cl/cb3542a830ef94d6f425b4c36b99c1f9/img/ubb_logo_new.png"
        alt="Logo"
        style={{ width: '400px', height: 'auto', margin: '0 auto 20px' }}
      />
      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        Bienvenido al Portal de Votaciones
      </Typography>
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '400px',
          width: '100%',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px', textAlign: 'center' }}>
          Iniciar sesión
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginBottom: '10px' }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Correo"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('email', { required: true })}
          error={!!errors.email}
          helperText={errors.email ? 'Correo es requerido' : ''}
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          {...register('password', { required: true })}
          error={!!errors.password}
          helperText={errors.password ? 'Contraseña is required' : ''}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '20px' }}>
          Acceder
        </Button>
        <Link to="/registro" style={{ marginTop: '20px', textAlign: 'center', textDecoration: 'none' }}>
          Ir a Registro
        </Link>
      </Paper>
    </Box>
  );
}

export default LoginForm;
