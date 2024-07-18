import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { createVotacion } from "../services/votacion.service";


export default function VotacionForm() {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
    createVotacion(payload).then(([data, error]) => {
      if (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error al crear la votación, "+error.message);
      } else {
        setSnackbarSeverity("success");
        setSnackbarMessage("Votación creada exitosamente");
        reset();
        setOptions([]);
        setError("");
      }
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOptionChange = (event) => {
    setNewOption(event.target.value);
  };

  const addOrEditOption = () => {
    if (newOption.trim() === "") return;

    if (options.includes(newOption.trim())) {
      setSnackbarMessage("La opción ya existe");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (editIndex !== null) {
      const updatedOptions = options.map((option, index) =>
        index === editIndex ? newOption.trim() : option
      );
      setOptions(updatedOptions);
      setEditIndex(null);
    } else {
      setOptions([...options, newOption.trim()]);
    }
    setNewOption("");
    setError("");
  };

  const editOption = (index) => {
    setNewOption(options[index]);
    setEditIndex(index);
  };

  const deleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };
  useEffect(() => {
    setValue("options", options); // Update the hidden field with the current options
  }, [options, setValue]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user.roles[0].name !== "admin" && 
      user.roles[0].name !== "Miembro de Tricel" && 
      user.roles[0].name !== "Presidente de Tricel"){
      navigate("/");
    }
  } , []);

  return (
    <Box
      component="form"
      sx={{ width: "70vw" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h4">Agregar votación</Typography>
      <TextField
        {...register("titulo", { required: true })}
        label="Título"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.titulo}
        helperText={errors.titulo ? "Título de votación es requerido" : ""}
      />
      <TextField
        {...register("descripcion", { required: true })}
        label="Descripción"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.descripcion}
        helperText={
          errors.descripcion ? "Descripción de votación es requerida" : ""
        }
      />
      <TextField
        {...register("fechaInicio", { required: true })}
        label="Fecha de inicio"
        variant="outlined"
        fullWidth
        type="datetime-local"
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.fechaInicio}
        helperText={errors.fechaInicio ? "Fecha de inicio es requerida" : ""}
      />
      <TextField
        {...register("fechaFin", { required: true })}
        label="Fecha de fin"
        variant="outlined"
        fullWidth
        type="datetime-local"
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.fechaFin}
        helperText={errors.fechaFin ? "Fecha de fin es requerida" : ""}
      />
      <TextField
        label="Nueva opción"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newOption}
        onChange={handleOptionChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addOrEditOption}
        style={{ marginBottom: "16px" }}
      >
        {editIndex !== null ? "Editar opción" : "Agregar opción"}
      </Button>
      {error && (
        <Typography color="error" style={{ marginBottom: "16px" }}>
          {error}
        </Typography>
      )}
      <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Opciones</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option, index) => (
              <TableRow key={index}>
                <TableCell>{option}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => editOption(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteOption(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center">
        <Button type="submit" variant="contained" color="secondary">
          Agregar Votación
        </Button>
      </Box>
    </Box>
  );
}
