import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Modal, Box, Typography, Alert 
} from '@mui/material';
import { getPostulaciones, updatePostulacion } from '../../services/tricel/postulaciones.service';
import axios from 'axios';
import { toast } from 'react-hot-toast';


const Postulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const data = await getPostulaciones();
        setPostulaciones(data);
        if (data.length === 0) {
          setError('No se encontraron postulaciones.');
        }
      } catch (err) {
        setError('Ocurrió un error al cargar las postulaciones.');
      }
    };
    fetchPostulaciones();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await updatePostulacion(id, { estado: 'Aceptado' });
      if (response.status === 200) {
        setPostulaciones((prevPostulaciones) =>
          prevPostulaciones.map((postulacion) =>
            postulacion._id === id ? { ...postulacion, estado: 'Aceptado' } : postulacion
          )
        );
        toast.success("Postulación aceptada con éxito.", {
          duration: 2000,
          isClosable: true,
        });
      } else {
        const errorMessage =
          response.data?.message || "Error al aceptar la postulación";
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
  
  const handleReject = async (id) => {
    try {
      const response = await updatePostulacion(id, { estado: 'Rechazado' });
      if (response.status === 200) {
        setPostulaciones((prevPostulaciones) =>
          prevPostulaciones.map((postulacion) =>
            postulacion._id === id ? { ...postulacion, estado: 'Rechazado' } : postulacion
          )
        );
        toast.success("Postulación rechazada con éxito.", {
          duration: 2000,
          isClosable: true,
        });
      } else {
        const errorMessage =
          response.data?.message || "Error al rechazar la postulación";
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
  

  const handleDetail = async (postulacion) => {
    setSelectedPostulacion(postulacion);
    setOpen(true);

    try {
      const res = await axios.get(`http://localhost:5000${postulacion.programa_trabajo}`, { responseType: 'blob' });
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (err) {
      setError('Ocurrió un error al cargar el programa de trabajo.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPostulacion(null);
    setPdfUrl('');
    setError('');
  };

  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la Lista</TableCell>
              <TableCell >Letra</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Fecha de Postulación</TableCell>
              <TableCell align="center" style={{ borderLeft: '2px solid #ddd' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postulaciones.length > 0 ? (
              postulaciones.map((postulacion) => (
                <TableRow key={postulacion._id}>
                  <TableCell>{postulacion.nombre}</TableCell>
                  <TableCell align="center">{postulacion.letra}</TableCell>
                  <TableCell>{postulacion.estado}</TableCell>
                  <TableCell align="center">{new Date(postulacion.fechaPostulacion).toLocaleDateString()}</TableCell>
                  <TableCell align="center" style={{ borderLeft: '2px solid #ddd' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleDetail(postulacion)}
                    >
                      Detalles
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success" 
                      onClick={() => handleAccept(postulacion._id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Aceptar
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleReject(postulacion._id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Rechazar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron postulaciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          {selectedPostulacion && (
            <>
              <Typography variant="h6" component="h2">
                {selectedPostulacion.nombre}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Letra: {selectedPostulacion.letra}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Estado: {selectedPostulacion.estado}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Fecha de Postulación: {new Date(selectedPostulacion.fechaPostulacion).toLocaleDateString()}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Programa de Trabajo: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Postulaciones;
