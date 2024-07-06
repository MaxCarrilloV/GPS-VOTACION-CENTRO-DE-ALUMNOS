// src/routes/Tricel/PeriodosElectivos.jsx

import React, { useState, useEffect } from "react";
import {
  getPeriodos,
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
import PeriodoForm from "../../components/PeriodoForm";

const PeriodosElectivos = () => {
  const [periodos, setPeriodos] = useState([]); // Inicializar como un arreglo vacío
  const [openPeriodoModal, setOpenPeriodoModal] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [procesoId, setProcesoId] = useState("6688c20018ec9dd4d69f0b52"); // Example procesoId
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPeriodos = async () => {
      const data = await getPeriodos();
      console.log("Fetched periodos: ", data); // Debugging
      setPeriodos(data || []); // Asegurar que `data` es un arreglo
    };
    fetchPeriodos();
  }, []);

  const handleClosePeriodoModal = () => {
    setOpenPeriodoModal(false);
    setSelectedPeriodo(null); // Limpiar el periodo seleccionado al cerrar el modal
    setFechaInicio(""); // Limpiar la fecha de inicio al cerrar el modal
  };

  const handleEditPeriodo = (periodo) => {
    setSelectedPeriodo(periodo);
    setFechaInicio(periodo.fechaInicio.split("T")[0]); // Cortar la fecha para el input
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

      const response = await updatePeriodo(
        selectedPeriodo._id,
        formattedPeriodo
      );

      if (response.status && response.status !== 200) {
        setModalMessage(response.data.message);
        toast.error(response.data.message);
      } else {
        const data = await getPeriodos();
        setPeriodos(data || []);
        setModalMessage("");
        handleClosePeriodoModal();
        toast.success("Periodo actualizado exitosamente!");
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el periodo.");
    }
  };

  const handlePeriodoCreated = async () => {
    const data = await getPeriodos();
    setPeriodos(data || []);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  const handleDeletePeriodo = async () => {
    try {
      if (!selectedPeriodo || !selectedPeriodo._id) {
        toast.error("No se ha seleccionado un periodo válido para eliminar.");
        return;
      }

      await deletePeriodo(selectedPeriodo._id);
      const data = await getPeriodos();
      setPeriodos(data || []);
      setDeleteModalOpen(false);
      setSelectedPeriodo(null);
      toast.success("Periodo eliminado exitosamente!");
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el periodo.");
    }
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Toaster position="top-right" reverseOrder={false} />

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenPeriodoModal(true)}
      >
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
                    {new Date(periodo.fechaInicio).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(periodo.fechaFin).toLocaleDateString()}
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
                        onClick={() => {
                          setSelectedPeriodo(periodo);
                          setDeleteModalOpen(true);
                        }}
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

      <PeriodoForm
        open={openPeriodoModal}
        onClose={handleClosePeriodoModal}
        onPeriodoCreated={handlePeriodoCreated}
        procesoId={procesoId}
      />

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>

      <Modal open={Boolean(selectedPeriodo)} onClose={handleClosePeriodoModal}>
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
            Editar Periodo
          </Typography>
          <TextField
            label="Fecha de Inicio (yyyy-mm-dd)"
            name="fechaInicio"
            value={fechaInicio}
            onChange={handleChangeFechaInicio}
            fullWidth
            margin="normal"
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
            Actualizar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PeriodosElectivos;
