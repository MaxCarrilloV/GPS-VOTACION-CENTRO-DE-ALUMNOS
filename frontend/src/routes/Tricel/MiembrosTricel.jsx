import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Container, Button } from '@mui/material';
import { getUsersTricel, updateRoleUser } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Tricel() {
    const [tricel, setTricel] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchTricel();
    }, []);

    const fetchTricel = async () => {
        try {
            const data = await getUsersTricel();
            console.log(data);
            setTricel(data);
        } catch (error) {
            console.error('Error al obtener el tricel:', error);
        }
    };

    const isAdmin = user?.roles[0]?.name === 'admin';

    const handleRoleUpdate = (id, role , data) => {
        if (!data) {
            data = {};
        }
        data.roles = [role];
        updateRoleUser(id, data)
            .then((response) => {
                fetchTricel();
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleNavigateToAddTricel = () => {
        navigate('/tricel/miembros/añadir');
    };

    return (
        <Container maxWidth="md">
            <Box p={4}>
                <Typography variant="h4" gutterBottom pb={1} align="center">
                    Miembros del Tricel
                </Typography>
                {isAdmin && (
                    <Button variant="contained" color="success" onClick={handleNavigateToAddTricel} sx={{ marginBottom: '15px', float: 'right'}}>
                        + Añadir Tricel    
                    </Button>
                )} 
                {tricel && tricel.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#2C6AA0'}}>
                                    <TableCell sx={{ color: '#fff' }}></TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Nombre</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Rol</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Ver Perfil</TableCell>
                                    {isAdmin && (
                                        <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tricel.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Avatar alt={item.username} src={`http://146.83.198.35:1245${item.profileImage}`} />
                                        </TableCell>
                                        <TableCell>{item.username}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.roles[0].name}</TableCell>
                                        <TableCell>
                                            <Link to={`/perfil?email=${item.email}`} style={{ textDecoration: 'none', color: '#2C6AA0', display: 'flex', alignItems: 'center' }}>
                                                <span style={{ marginRight: '4px' }}>Ver</span>
                                                <VisibilityIcon sx={{ color: '#2C6AA0' }}/>
                                            </Link>
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell>
                                                {item.roles[0].name === 'Miembro de Tricel' && (
                                                    <>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            sx={{ marginBottom: '10px'}}
                                                            onClick={() => handleRoleUpdate(item._id, 'Presidente de Tricel')}
                                                        >
                                                            Agregar Presidente
                                                        </Button>
                                                        <Button 
                                                            variant="contained" 
                                                            color="secondary"
                                                            onClick={() => handleRoleUpdate(item._id, 'user')}
                                                        >
                                                            Quitar Tricel
                                                        </Button>
                                                    </>
                                                )}
                                                {item.roles[0].name === 'Presidente de Tricel' && (
                                                    <>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            sx={{ marginBottom: '10px'}}
                                                            onClick={() => handleRoleUpdate(item._id, 'Miembro de Tricel')}
                                                        >
                                                            Quitar Presidente
                                                        </Button>
                                                        <Button 
                                                            variant="contained" 
                                                            color="secondary"
                                                            onClick={() => handleRoleUpdate(item._id, 'user')}
                                                        >
                                                            Quitar Tricel
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" align="center">
                        No existen usuarios en el Tricel.
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default Tricel;
