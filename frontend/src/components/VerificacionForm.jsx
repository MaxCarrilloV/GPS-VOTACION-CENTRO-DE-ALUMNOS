import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { confirmUser } from '../services/user.service';
import { logout } from '../services/auth.service';
import { useState } from 'react';

function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.active) {
      navigate('/');
    } 
  }, [user, navigate]);

  const onSubmit = (data) => {
    if (!user) {
        navigate('/auth');
    } 
    const mail = user.email;

    confirmUser(mail, data)
        .then((response) => {
            if (response[0].state === 'Success') {
                user.active = true;
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            }
        })
        .catch(error => {
          setError(error.message);
        });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
          Verificar Cuenta
        </Typography>
        <Typography variant="p" sx={{ marginBottom: '10px', textAlign: 'center' }}>
          El Código de Verificación ha sido enviado a tu correo. Ingrésalo aquí:
        </Typography>
        {error && (
            <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginBottom: '10px' }}>
              {error}
            </Typography>
          )}
        <TextField
          label="Código"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('codigo', { required: true })}
          error={!!errors.codigo}
          helperText={errors.codigo ? 'Código es requerido' : ''}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '20px' }}>
          Acceder
        </Button>
        <Link to="#" onClick={handleLogout} style={{ marginTop: '20px', textAlign: 'center', textDecoration: 'none' }}>
          Cerrar Sesión
        </Link>
      </Paper>
    </Box>
  );
}

export default LoginForm;
