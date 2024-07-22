import React from "react";
import { Avatar, Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserByEmail } from "../../services/user.service";

function MiPerfil() {
    const { user } = useAuth();
    const [usuario, setUsuario] = React.useState(null);

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

    const roleName = usuario.roles[0].name === 'user' ? 'Estudiante' : usuario.roles[0].name;

    return (
        <Container fixed sx={{ backgroundColor: '#e0e9ef', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'}}>
            <Grid container mt={2}>
                <Grid item xs={0} md={2}></Grid>
                <Grid item p={2} xs={12} md={3}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '100%',
                            overflow: 'hidden',
                            borderRadius: '50%',
                        }}
                    >
                        <Avatar
                            alt="Imagen Perfil"
                            src="https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg"
                            sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Grid>
                <Grid container xs={12} md={5} p={2} pl={4} alignItems="center" justifyContent="center">
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                        <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', color: '#2C6AA0', marginBottom: 1 }}>
                            {usuario.username}
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="h4" gutterBottom sx={{ color: '#6d6d6d', marginBottom: 1 }}>
                            {usuario.email}
                        </Typography>
                        <Typography px={1} variant="h5" sx={{ backgroundColor: '#e97827', color: 'white', borderRadius: 3, width: 'fit-content', margin: 'auto'}}>
                            {roleName}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={0} md={2}></Grid>
            </Grid>
        </Container>
    );
}

export default MiPerfil;
