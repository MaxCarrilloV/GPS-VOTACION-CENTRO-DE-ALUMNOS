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
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import PeriodoForm from "../../components/PeriodoForm";
import DeletePeriodoModal from "../../components/DeletePeriodoModal";

const PeriodosElectivos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [openPeriodoModal, setOpenPeriodoModal] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPeriodos = async () => {
      const data = await getPeriodos();
      console.log("Fetched periodos: ", data); // Debugging
      setPeriodos(data || []);
    };
    fetchPeriodos();
  }, []);

  const handleClosePeriodoModal = () => {
    setOpenPeriodoModal(false);
    setSelectedPeriodo(null);
  };

  const handleOpenDeleteModal = (periodo) => {
    setSelectedPeriodo(periodo);
    setDeleteModalOpen(true);
    setOpenPeriodoModal(false);
  };

  const handleOpenCreatePeriodoModal = () => {
    setSelectedPeriodo(null);
    setOpenPeriodoModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Añade un día a la fecha
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Toaster position="top-right" reverseOrder={false} />

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreatePeriodoModal}
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
                        onClick={() => handleOpenDeleteModal(periodo)}
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
        fetchPeriodos={async () => {
          const data = await getPeriodos();
          setPeriodos(data || []);
        }}
      />

      <DeletePeriodoModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedPeriodo={selectedPeriodo}
        deletePeriodo={deletePeriodo}
        refreshPeriodos={async () => {
          const data = await getPeriodos();
          setPeriodos(data || []);
        }}
      />
    </div>
  );
};

export default PeriodosElectivos;
