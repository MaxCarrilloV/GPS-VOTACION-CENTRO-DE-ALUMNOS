import React, { useState, useEffect } from 'react';
import { getProcesos, createProceso, updateFinalizadoProceso, deleteProceso } from '../../services/Tricel/procesos.service';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Modal, Box, Typography, TextField, FormHelperText 
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

const ProcesosElectivos = () => {
  const [procesos, setProcesos] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProceso, setNewProceso] = useState({ nombre: '' });
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchProcesos = async () => {
      const data = await getProcesos();
      setProcesos(data);
    };
    fetchProcesos();
  }, []);

  const handleOpen = () => {
    setModalMessage('');
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProceso({ ...newProceso, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await createProceso(newProceso);
      if (response.status && response.status !== 200) {
        // Si hay un error, mostramos el mensaje en el modal y en un toast
        setModalMessage(response.data.message);
        toast.error(response.data.message);
      } else {
        const data = await getProcesos();
        setProcesos(data);
        setModalMessage('');
        handleClose();
        toast.success('Proceso creado exitosamente!');
      }
    } catch (error) {
      // Capturamos cualquier error inesperado
      toast.error('Ocurrió un error al crear el proceso.');
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Crear Nuevo Proceso
      </Button>
      <div style={{ marginTop: '20px', overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Proceso</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Semestre</TableCell>
                <TableCell>Vueltas</TableCell>
                <TableCell>Finalizado</TableCell>
                <TableCell>Periodos</TableCell>
                <TableCell>Postulaciones</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {procesos.map((proceso) => (
                <TableRow key={proceso._id}>
                  <TableCell>{proceso.nombre}</TableCell>
                  <TableCell>{proceso.year}</TableCell>
                  <TableCell align="center">{proceso.semester}</TableCell>
                  <TableCell align="center">{proceso.vueltas}</TableCell>
                  <TableCell align="center">{proceso.finalizado ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{proceso.periodos.join(', ')}</TableCell>
                  <TableCell>{proceso.postulaciones.join(', ')}</TableCell>
                  <TableCell>{new Date(proceso.fechaCreacion).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button variant="contained" color="success" style={{ margin: '0 10px' }}>
                        Editar
                      </Button>
                      <Button variant="contained" color="error" style={{ margin: '0 10px' }}>
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Crear Nuevo Proceso
          </Typography>
          <TextField 
            label="Nombre del Proceso"
            name="nombre"
            value={newProceso.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!modalMessage}
          />
          {modalMessage && <FormHelperText error>{modalMessage}</FormHelperText>}
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Crear
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ProcesosElectivos;
