import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Container } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Avatar } from '@mui/material';
import { updateUser } from '../services/user.service';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const UpdateProfileForm = ({ user, onCancel }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: user.username,
        rut: user.rut ? user.rut : 'No especificado',
        contact: user.contact ? user.contact : 'No especificado',
        profileImage: null, // Aquí se almacenará la imagen seleccionada
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            profileImage: file,
        });

        // Mostrar la vista previa de la imagen seleccionada
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('username', formData.username);
        form.append('rut', formData.rut);
        form.append('contact', formData.contact);
        if (formData.profileImage) {
            form.append('Imagen_Perfil', formData.profileImage);
        }
    
        // Mostrar el modal de confirmación
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres guardar los cambios?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const [response, error] = await updateUser(user._id, form);
                    if (response) {
                        console.log('User updated successfully:', response);
                        // Mostrar alerta de éxito
                        Swal.fire('¡Guardado!', 'Los cambios se guardaron correctamente.', 'success')
                            .then(() => {
                                window.location.reload();
                            });
                    } else {
                        console.error('Error updating user:', error);
                        Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error');
                    }
                } catch (error) {
                    console.error('Error updating user:', error);
                    Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error');
                }
            }
        });
    };

    return (
        <Container fixed>
            <Box sx={{ 
                backgroundColor: '#e0e9ef', 
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', 
                borderRadius: 10, 
                background: 'linear-gradient(to right top, #f0f0f0, #e0e0e0)', 
                py: 2, 
                mt: 2 
            }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                    Actualizar Perfil
                </Typography>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid container spacing={2} alignItems="center" justifyContent="center" px={10}>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Avatar
                                alt="Imagen Perfil"
                                src={imagePreview || `http://146.83.198.35:1245${user.profileImage}`} 
                                sx={{ width: 200, height: 200, objectFit: 'cover', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="avatar-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="avatar-upload">
                                <Button
                                    variant="contained"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    Subir Imagen de Perfil
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Nombre:
                            </Typography>
                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                variant="outlined"
                                value={formData.username}
                                placeholder="Nombre de usuario"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Rut:
                            </Typography>
                            <TextField
                                fullWidth
                                id="rut"
                                name="rut"
                                variant="outlined"
                                value={formData.rut}
                                placeholder="RUT"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Contacto:
                            </Typography>
                            <TextField
                                fullWidth
                                id="contact"
                                name="contact"
                                variant="outlined"
                                value={formData.contact}
                                placeholder="Información de contacto"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Box>
                                <Button variant="contained" color="primary" type="submit" sx={{ mr: 2, marginTop: '0px !important' }}>
                                    Guardar Cambios
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onCancel}>
                                    Cancelar
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default UpdateProfileForm;
