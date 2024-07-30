// src/routes/PostulacionForm.jsx
import React, { useState, useEffect } from 'react';
import { createPostulacion } from '../services/Tricel/postulaciones.service';
import { getProcesos } from '../services/Tricel/procesos.service';
import { Container, TextField, Button, Typography, Box, Card, CardContent, Link } from '@mui/material';
import { toast } from 'react-hot-toast';

const PostulacionForm = () => {
  const [nombre, setNombre] = useState('');
  const [programaTrabajo, setProgramaTrabajo] = useState(null);
  const [programaTrabajoPreview, setProgramaTrabajoPreview] = useState(null);
  const [procesoId, setProcesoId] = useState('');
  const [procesoNombre, setProcesoNombre] = useState('');

  useEffect(() => {
    const fetchActiveProceso = async () => {
      try {
        const procesos = await getProcesos();
        const activeProceso = procesos.find(proceso => !proceso.finalizado);
        if (activeProceso) {
          setProcesoId(activeProceso._id);
          setProcesoNombre(activeProceso.nombre);
        }
      } catch (error) {
        console.error('Error al obtener los procesos:', error);
      }
    };

    fetchActiveProceso();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProgramaTrabajo(file);
    setProgramaTrabajoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('programa_trabajo', programaTrabajo);
    formData.append('estado', 'Enviado');
    formData.append('procesoId', procesoId);

    try {
      const response = await createPostulacion(formData);
      console.log('response: ', response);
      if (response.status === 200 || response.status === 201) {
        // Si la creación es exitosa
        toast.success("Postulación creada con éxito.", {
          duration: 2000,
          isClosable: true,
        });

        // Resetear el formulario o manejar la respuesta como sea necesario
        setNombre('');
        setProgramaTrabajo(null);
        setProgramaTrabajoPreview(null);
      } else {
        // Si ocurre un error
        const errorMessage =
          response.data?.message || "Error al crear la postulación";
        toast.error(`Error: ${errorMessage}`, {
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error inesperado.";
      toast.error(`Error: ${errorMessage}`, {
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Crear Postulación
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Proceso en curso: {procesoNombre}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre de la lista"
                  variant="outlined"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Box>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  component="label"
                >
                  Subir Programa de Trabajo
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    required
                  />
                </Button>
                {programaTrabajoPreview && (
                  <Box sx={{ ml: 2 }}>
                    <Link href={programaTrabajoPreview} target="_blank" rel="noopener">
                      Ver Programa de Trabajo
                    </Link>
                  </Box>
                )}
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!procesoId}
              >
                Crear Postulación
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PostulacionForm;
