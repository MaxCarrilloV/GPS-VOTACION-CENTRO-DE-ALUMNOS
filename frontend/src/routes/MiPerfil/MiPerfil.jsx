import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getUserByEmail } from "../../services/user.service";
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UpdateProfileForm from "../../components/UpdateProfileForm";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function MiPerfil() {
    const { user } = useAuth();
    const [usuario, setUsuario] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            if (user && user.email) {
              const loadedUser = await getUserByEmail(user.email);
              if (loadedUser && loadedUser.length > 0) {
                setUsuario(loadedUser[0].user);
              } else {
                console.error('No se encontró ningún usuario.');
              }
            }
          } catch (error) {
            console.error('Error al obtener el usuario:', error.message);
          }
        };
    
        fetchUser();
    }, [user]);
    
    if (!usuario) {
        return <p>Cargando usuario...</p>; // Mensaje de carga mientras se carga el usuario
    }

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
    };

    if (editing) {
        return <UpdateProfileForm user={usuario} onCancel={handleCancelEdit} />;
    }

    const roleName = usuario.roles[0].name === 'user' ? 'Estudiante' : usuario.roles[0].name;

    return (
        <Container fixed>
            <Grid container direction="column" alignItems="center" py={2} sx={{ backgroundColor: '#e0e9ef', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', borderRadius: 10, background: 'linear-gradient(to right top, #f0f0f0, #e0e0e0)' }}>
                <Grid item xs={12} display="flex" justifyContent="center" p={2}>
                    <Avatar
                        alt="Imagen Perfil"
                        src={`http://146.83.198.35:1245${usuario.profileImage}`} // Aquí se usa la URL de la imagen de perfil del usuario
                        sx={{ width: 200, height: 200, objectFit: 'cover', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                    />
                </Grid>
                <Grid item xs={12} p={1} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        <PersonIcon sx={{ fontSize: 20, color: '#2C6AA0', marginRight: 1 }} />
                        Nombre: <span style={{ color: '#2C6AA0' }}>{usuario.username}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} p={1} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        <EmailIcon sx={{ fontSize: 20, color: '#2C6AA0', marginRight: 1 }} />
                        Correo: <span style={{ color: '#2C6AA0' }}>{usuario.email}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} p={1} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        <VerifiedUserIcon sx={{ fontSize: 20, color: '#2C6AA0', marginRight: 1 }} />
                        Rol: <span style={{ color: '#2C6AA0' }}>{roleName}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} p={1} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        <AccountBoxIcon sx={{ fontSize: 20, color: '#2C6AA0', marginRight: 1 }} />
                        RUT: <span style={{ color: '#2C6AA0' }}>{usuario.rut ? usuario.rut : 'No especificado'}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} p={1} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        <ContactPhoneIcon sx={{ fontSize: 20, color: '#2C6AA0', marginRight: 1 }} />
                        Contact: <span style={{ color: '#2C6AA0' }}>{usuario.contact ? usuario.contact : 'No especificado'}</span>
                    </Typography>
                </Grid>
                <Box alignItems="center" my={2} sx={{ flexDirection: 'column', display: 'flex'}}>
                    <Button variant="contained" startIcon={<EditIcon />} sx={{ backgroundColor: '#2C6AA0', color: 'white', '&:hover': { backgroundColor: '#1e4f79' } }} onClick={handleEditClick}>
                        Editar Perfil
                    </Button>
                </Box>
            </Grid>
        </Container>
    );
}

export default MiPerfil;
