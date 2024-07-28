// src/components/Tricel/ConfirmDeleteModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, handleClose, handleConfirm }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
          Confirmar eliminación
        </Typography>
        <Typography sx={{ mt: 2 }}>
          ¿Estás seguro de que deseas eliminar este proceso?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleClose} style={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Eliminar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
