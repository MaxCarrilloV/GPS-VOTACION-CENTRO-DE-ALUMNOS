import React, { useState, useEffect } from "react";
import {
  Box,Button,Modal,TextField,Typography,IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { updatePeriodo } from "../../services/Tricel/periodos.service"; 
import { format, toZonedTime } from "date-fns-tz";

const EditPeriodoModal = ({ open, onClose, periodoId, currentFechaInicio, fetchPeriodos }) => {
  const [fechaInicio, setFechaInicio] = useState(currentFechaInicio || ""); 
  const [error, setError] = useState(false);

  useEffect(() => {
    setFechaInicio(currentFechaInicio || "");
  }, [currentFechaInicio]);

  const handleUpdatePeriodo = async () => {
    if (!fechaInicio) {
      setError(true);
      return;
    }

    const timeZone = "America/Santiago";
    const zonedDate = toZonedTime(fechaInicio, timeZone);
    const formattedFechaInicio = format(zonedDate, "dd-MM-yyyy");

    const updatedPeriodo = {
      fechaInicio: formattedFechaInicio,
    };

    try {
      const response = await updatePeriodo(periodoId, updatedPeriodo);
      if (response.status === 200 || response.status === 204) {
        toast.success("Periodo modificado con éxito.", {
          duration: 2000,
          isClosable: true,
        });

        onClose();
        //fetchPeriodos(); // Actualizar la lista de periodos
      } else {
        const errorMessage =
          response.data?.message || "Error al modificar el periodo.";
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

  const handleClose = () => {
    onClose();
    setFechaInicio(currentFechaInicio || "");
    setError(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Modificar Fecha de Inicio
        </Typography>
        <TextField
          label="Fecha de Inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          fullWidth
          margin="dense"
          InputLabelProps={{
            shrink: true,
          }}
          error={error}
          helperText={error && "Campo obligatorio"}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdatePeriodo}
          sx={{ mt: 2 }}
        >
          Modificar
        </Button>
      </Box>
    </Modal>
  );
};

export default EditPeriodoModal;