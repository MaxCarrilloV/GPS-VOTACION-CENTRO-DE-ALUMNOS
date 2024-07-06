import { useForm } from 'react-hook-form';
import { createUser } from '../services/user.service';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

function RegisterForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        data.roles = ['user'];

        console.log(data);

        createUser(data)
            .then((response) => {
                console.log(response);
                if (response[0].state === 'Success') {
                    navigate('/profile');
                }
            })
            .catch(error => {
                console.error(error);
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
            Registro
          </Typography>
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('username', { required: true })}
            error={!!errors.username}
            helperText={errors.username ? 'Nombre de usuario es requerido' : ''}
          />
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
            Registrarse
          </Button>
          <Link to="/auth" style={{ marginTop: '20px', textAlign: 'center', textDecoration: 'none' }}>
            Ir a Iniciar Sesión
          </Link>
        </Paper>
      </Box>
    );
}

export default RegisterForm;

           