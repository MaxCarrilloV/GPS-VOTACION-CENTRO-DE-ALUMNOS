// src/components/Tricel/EditProcesoModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { updateFinalizadoProceso } from '../../services/Tricel/procesos.service';
import toast from 'react-hot-toast';

const EditProcesoModal = ({ open, handleClose, proceso }) => {
  const handleFinalizar = async () => {
    try {
      await updateFinalizadoProceso(proceso._id, true);
      toast.success(`Proceso "${proceso.nombre}" finalizado exitosamente!`);
      handleClose();
    } catch (error) {
      toast.error('Ocurrió un error al finalizar el proceso.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
          Confirmar Finalización
        </Typography>
        <Typography sx={{ mt: 2 }}>
          ¿Está seguro que desea finalizar el proceso "{proceso.nombre}"?
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFinalizar} style={{ marginTop: '20px' }}>
          Finalizar Proceso
        </Button>
        <Button variant="contained" onClick={handleClose} style={{ marginTop: '20px', marginLeft: '10px' }}>
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

export default EditProcesoModal;
