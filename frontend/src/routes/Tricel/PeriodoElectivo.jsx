import React, { useState, useEffect } from "react";
import {
  getPeriodos,
  createPeriodo,
  updatePeriodo,
  deletePeriodo,
} from "../../services/Tricel/periodos.service";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormHelperText,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const PeriodosElectivos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [openPeriodoModal, setOpenPeriodoModal] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchPeriodos = async () => {
      const data = await getPeriodos();
      console.log("Fetched periodos: ", data); // Debugging
      setPeriodos(data);
    };
    fetchPeriodos();
  }, []);

  const handleClosePeriodoModal = () => {
    setOpenPeriodoModal(false);
    setSelectedPeriodo(null); // Limpiar el periodo seleccionado al cerrar el modal
    setFechaInicio(""); // Limpiar la fecha de inicio al cerrar el modal
  };

  const handleEditPeriodo = (periodo) => {
    const date = new Date(periodo.fechaInicio);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajustar zona horaria
    setSelectedPeriodo(periodo);
    setFechaInicio(date.toISOString().split("T")[0]); // Formatear la fecha para el input
    setOpenPeriodoModal(true);
  };

  const handleChangeFechaInicio = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleSubmitPeriodo = async () => {
    try {
      if (!selectedPeriodo || !selectedPeriodo._id) {
        toast.error("No se ha seleccionado un periodo válido para actualizar.");
        return;
      }
      
      const formattedPeriodo = {
        fechaInicio: fechaInicio, 
      };

      const response = await updatePeriodo(selectedPeriodo._id, formattedPeriodo);

      if (response.status && response.status !== 200) {
        setModalMessage(response.data.message);
        toast.error(response.data.message);
      } else {
        const data = await getPeriodos();
        setPeriodos(data);
        setModalMessage("");
        handleClosePeriodoModal();
        toast.success("Periodo actualizado exitosamente!");
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el periodo.");
    }
  };

  const formatDate = (date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()); // Ajustar zona horaria
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return adjustedDate.toLocaleDateString('es-ES', options);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Sección de Periodos */}
      <Button variant="contained" color="primary" onClick={() => setOpenPeriodoModal(true)}>
        Crear Nuevo Periodo
      </Button>
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Periodo</TableCell>
                <TableCell>Número de Etapa</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Duración</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periodos.map((periodo) => (
                <TableRow key={periodo._id}>
                  <TableCell>{periodo.nombre_etapa}</TableCell>
                  <TableCell align="center">{periodo.numero_etapa}</TableCell>
                  <TableCell align="center">
                    {formatDate(periodo.fechaInicio)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(periodo.fechaFin)}
                  </TableCell>
                  <TableCell align="center">{periodo.duracion}</TableCell>
                  <TableCell align="center">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ margin: "0 10px" }}
                        onClick={() => handleEditPeriodo(periodo)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        style={{ margin: "0 10px" }}
                        onClick={() => handleDeletePeriodo(periodo._id)}
                      >
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

      <Modal open={openPeriodoModal} onClose={handleClosePeriodoModal}>
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
            {selectedPeriodo ? "Actualizar Periodo" : "Crear Nuevo Periodo"}
          </Typography>
          {selectedPeriodo && (
            <Typography variant="subtitle1" component="div">
              Nombre del Periodo: {selectedPeriodo.nombre_etapa}
            </Typography>
          )}
          <TextField
            label="Fecha de Inicio (yyyy-mm-dd)"
            name="fechaInicio"
            value={fechaInicio}
            onChange={handleChangeFechaInicio}
            fullWidth
            margin="normal"
            error={!!modalMessage}
            placeholder="yyyy-mm-dd"
          />
          {modalMessage && (
            <FormHelperText error>{modalMessage}</FormHelperText>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitPeriodo}
            style={{ marginTop: "20px" }}
          >
            {selectedPeriodo ? "Actualizar" : "Crear"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PeriodosElectivos;
