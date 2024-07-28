import React, { useState, useEffect } from 'react';
import { getProcesos, deleteProceso, updateFinalizadoProceso, createProceso} from '../../services/Tricel/procesos.service';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Modal, Box, TextField, Typography 
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import EditProcesoModal from '../../components/Tricel/EditProcesoModal';
import ConfirmDeleteModal from '../../components/Tricel/ConfirmDeleteModal';

const ProcesosElectivos = () => {
  const [procesos, setProcesos] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [newProceso, setNewProceso] = useState({
    nombre: ''
  });

  const fetchProcesos = async () => {
    try {
      const data = await getProcesos();
      setProcesos(data);
    } catch (error) {
      console.error('Error al obtener los procesos:', error);
    }
  };

  useEffect(() => {
    fetchProcesos();
  }, []);

  const handleEditOpen = (proceso) => {
    setSelectedProceso(proceso);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedProceso(null);
    setEditOpen(false);
  };

  const handleDeleteOpen = (proceso) => {
    if (proceso.finalizado) {
      toast.error(`El proceso "${proceso.nombre}" ya está finalizado y no se puede eliminar.`);
    } else {
      setSelectedProceso(proceso);
      setDeleteOpen(true);
    }
  };

  const handleDeleteClose = () => {
    setSelectedProceso(null);
    setDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('selectedProcesoID: ', selectedProceso._id);
      await deleteProceso(selectedProceso._id);
  
      toast.success(`Proceso "${selectedProceso.nombre}" eliminado exitosamente!`);
      handleDeleteClose();
      fetchProcesos(); // Actualizar la tabla
    } catch (error) {
      toast.error('Ocurrió un error al eliminar el proceso.');
    }
  };

  const handleFinalizar = async (proceso) => {
    try {
      await updateFinalizadoProceso(proceso._id, true);
      toast.success(`Proceso "${proceso.nombre}" finalizado exitosamente!`);
      fetchProcesos(); // Actualizamos la tabla
    } catch (error) {
      toast.error('Ocurrió un error al finalizar el proceso.');
    }
  };

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewProceso({
      ...newProceso,
      [name]: value,
    });
  };

  const handleCreateSubmit = async () => {
    try {
      console.log('newProceso: ', newProceso);
      await createProceso(newProceso);
      toast.success('Proceso creado exitosamente!');
      handleCreateClose();
      fetchProcesos(); // Actualizamos la tabla
    } catch (error) {
      toast.error('Ocurrió un error al crear el proceso.');
    }
  };


  return (
    <div style={{ overflow: 'hidden' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginBottom: '20px' }} 
        onClick={handleCreateOpen}
      >
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
              {procesos.length > 0 ? (
                procesos.map((proceso) => (
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
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          disabled={proceso.finalizado}
                          onClick={() => {
                            if (!proceso.finalizado) {
                              handleEditOpen(proceso);
                            } else {
                              toast.error(`El proceso "${proceso.nombre}" ya está finalizado.`);
                            }
                          }}
                        >
                          Finalizar Proceso
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error"
                          disabled={proceso.finalizado}
                          onClick={() => handleDeleteOpen(proceso)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay procesos electivos vigentes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {selectedProceso && (
        <EditProcesoModal 
          open={editOpen} 
          handleClose={handleEditClose} 
          proceso={selectedProceso} 
        />
      )}

      {selectedProceso && (
        <ConfirmDeleteModal 
          open={deleteOpen} 
          handleClose={handleDeleteClose} 
          handleConfirm={handleDeleteConfirm} 
        />
      )}


<Modal open={createOpen} onClose={handleCreateClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Crear Nuevo Proceso
          </Typography>
          <TextField 
            label="Nombre del Proceso"
            name="nombre"
            value={newProceso.nombre}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            placeholder="Ingrese el nombre del proceso"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateSubmit} 
            style={{ marginTop: '20px' }}
          >
            Crear
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ProcesosElectivos;
