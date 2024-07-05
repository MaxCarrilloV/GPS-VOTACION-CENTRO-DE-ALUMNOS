import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Modal, Box, Typography 
} from '@mui/material';
import { getPostulaciones } from '../../services/tricel/postulaciones.service';

const Postulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      const data = await getPostulaciones();
      setPostulaciones(data);
    };
    fetchPostulaciones();
  }, []);

  const handleAccept = (id) => {
    console.log(`Accepting postulation with id ${id}`);
    // Implementar lógica para aceptar la postulación
  };

  const handleReject = (id) => {
    console.log(`Rejecting postulation with id ${id}`);
    // Implementar lógica para rechazar la postulación
  };

  const handleDetail = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPostulacion(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la Lista</TableCell>
              <TableCell>Letra</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Postulación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postulaciones.map((postulacion) => (
              <TableRow key={postulacion._id}>
                <TableCell>{postulacion.nombre}</TableCell>
                <TableCell>{postulacion.letra}</TableCell>
                <TableCell>{postulacion.estado}</TableCell>
                <TableCell>{new Date(postulacion.fechaPostulacion).toLocaleDateString()}</TableCell>
                <TableCell>
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
            ))}
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
                Programa de Trabajo: <a href={selectedPostulacion.programa_trabajo} target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Postulaciones;
