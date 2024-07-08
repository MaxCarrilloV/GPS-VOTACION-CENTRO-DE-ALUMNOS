// src/components/DeletePeriodoModal.jsx

import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import toast from "react-hot-toast";

const DeletePeriodoModal = ({
  open,
  onClose,
  selectedPeriodo,
  deletePeriodo,
  refreshPeriodos,
}) => {
  const handleDeletePeriodo = async () => {
    try {
      if (!selectedPeriodo || !selectedPeriodo._id) {
        toast.error("No se ha seleccionado un periodo válido para eliminar.");
        return;
      }

      await deletePeriodo(selectedPeriodo._id);
      await refreshPeriodos();
      onClose();
      toast.success("Periodo eliminado exitosamente!");
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el periodo.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Confirmar Eliminación
        </Typography>
        {selectedPeriodo && (
          <Typography variant="subtitle1" component="div" sx={{ mb: 2 }}>
            ¿Está seguro de que desea eliminar el periodo{" "}
            <strong>{selectedPeriodo.nombre_etapa}</strong>?
          </Typography>
        )}
        <Button
          variant="contained"
          color="error"
          onClick={handleDeletePeriodo}
          style={{ marginRight: "10px" }}
        >
          Eliminar
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

export default DeletePeriodoModal;
