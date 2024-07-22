import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Paper,
  Alert,
  Snackbar,
  Modal,
} from "@mui/material";
import { updateVotacion } from "../services/votacion.service";

function formatDate(dateString) {
  const [datePart, timePart] = dateString.split(", ");
  const [day, month, year] = datePart.split("-");
  let [time, period] = timePart.split(" ");
  let [hours, minutes, seconds] = time.split(":");
  hours = parseInt(hours, 10);
  if (period === "p. m." && hours < 12) {
    hours += 12;
  } else if (period === "a. m." && hours === 12) {
    hours = 0;
  }
  return new Date(year, month - 1, day, hours, minutes, seconds)
    .toISOString()
    .slice(0, 16);
}

export default function VotacionEditForm({ votacion, open, onClose }) {
  const [options, setOptions] = useState(
    votacion?.opciones?.map((opcion) => opcion.opcion)
  );
  const [newOption, setNewOption] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleAddOption = () => {
    if (newOption) {
      if (editIndex !== null) {
        const newOptions = [...options];
        newOptions[editIndex] = newOption;
        setOptions(newOptions);
        setEditIndex(null);
      } else {
        setOptions([...options, newOption]);
      }
      setNewOption("");
    }
  };

  const handleEdit = (index) => {
    setNewOption(options[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    if (options.length < 2) {
      setError("Debes agregar al menos dos opciones.");
      return;
    }
    if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
      setSnackbarMessage(
        "La fecha de fin debe ser mayor que la fecha de inicio"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    const payload = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      opciones: options.map((opcion) => ({ opcion })),
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
    };
    updateVotacion(votacion.id, payload).then(([data, error]) => {
      if (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage(error);
        setSnackbarOpen(true);
      } else {
        setSnackbarSeverity("success");
        setSnackbarMessage("Votación editada exitosamente");
        setSnackbarOpen(true);
        setTimeout(() => {
            setSnackbarOpen(false);
            onClose();
            window.location.reload();
          }, 2000);
      }
    });
  };

  const handleClose = () => {
    setOptions(votacion.opciones.map((opcion) => opcion.opcion));
    setNewOption("");
    setEditIndex(null);
    setError("");
    setSnackbarOpen(false);
    onClose();
  };

  useEffect(() => {
    if (votacion) {
      setValue("titulo", votacion.titulo);
      setValue("descripcion", votacion.descripcion);
      setValue("fechaInicio", formatDate(votacion.fechaInicio));
      setValue("fechaFin", formatDate(votacion.fechaFin));
      setOptions(votacion.opciones.map((opcion) => opcion.opcion));
    }
  }, [votacion, setValue]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ overflowY: "scroll", mb: 2 }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "50%",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          transform: "translate(-60%, -50%)",
          p: 4,
        }}

        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4">Editar votación</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          label="Título"
          variant="outlined"
          fullWidth
          {...register("titulo", { required: true })}
          defaultValue={votacion?.titulo}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descripción"
          variant="outlined"
          fullWidth
          {...register("descripcion", { required: true })}
          defaultValue={votacion?.descripcion}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Fecha de inicio"
          type="datetime-local"
          variant="outlined"
          fullWidth
          {...register("fechaInicio", { required: true })}
          defaultValue={votacion?.fechaInicio}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Fecha de término"
          type="datetime-local"
          variant="outlined"
          fullWidth
          {...register("fechaFin", { required: true })}
          defaultValue={votacion?.fechaFin}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nueva opción"
          variant="outlined"
          fullWidth
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <Button onClick={handleAddOption}>Agregar opción</Button>
        <TableContainer sx={{ mb: 2 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Opción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {options?.map((option, index) => (
                <TableRow key={index}>
                  <TableCell>{option}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center">
          <Button type="submit">Editar votación</Button>
        </Box>
      </Box>
    </Modal>
  );
}
