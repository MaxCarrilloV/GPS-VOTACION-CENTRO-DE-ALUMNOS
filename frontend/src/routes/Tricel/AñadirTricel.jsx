import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Container, Button, TextField } from '@mui/material';
import { getUsers, getUsersTricel, updateRoleUser } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AñadirTricel() {
    const [usuarios, setUsuarios] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user.roles[0].name !== 'admin') {
            navigate('/');
        }

        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const data = await getUsers();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }

    if (!usuarios) {
        return <Typography variant="h6">Cargando usuarios...</Typography>;
    }

    const handleRoleUpdate = (id, role, data) => {
        if (!data) {
            data = {};
        }
        data.roles = [role];
        updateRoleUser(id, data)
            .then((response) => {
                fetchUsuarios(); // Actualiza la lista de usuarios después de actualizar el rol
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleNavigateToTricel = () => {
        navigate('/tricel/miembros'); // Llama a navigate con la ruta deseada
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtrar usuarios por email
    const filteredUsuarios = usuarios.filter((usuario) => {
        return usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Container maxWidth="md">
            <Box p={4}>
                <Typography variant="h4" gutterBottom pb={1} align="center">
                    Añadir Tricel
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                        label="Buscar por email"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ marginBottom: '15px', maxWidth: '50%'}}
                    />
                    <Button variant="contained" color="success" onClick={handleNavigateToTricel} sx={{ marginBottom: '15px'}}>
                        Volver a Miembros  
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#2C6AA0'}}>
                                <TableCell sx={{ color: '#fff' }}></TableCell>
                                <TableCell sx={{ color: '#fff' }}>Nombre</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Rol</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsuarios.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <Avatar alt={item.username} src={`URL_DE_LA_IMAGEN/${item.username}.jpg`} />
                                    </TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.roles[0].name}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            sx={{ marginBottom: '10px'}}
                                            onClick={() => handleRoleUpdate(item._id, 'Miembro de Tricel')}
                                        >
                                            Agregar Tricel
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default AñadirTricel;
