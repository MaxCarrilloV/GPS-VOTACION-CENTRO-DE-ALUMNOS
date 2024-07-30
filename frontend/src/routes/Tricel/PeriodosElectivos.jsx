import React, { useState, useEffect } from "react";
import {
  getPeriodos,
  updatePeriodo,
  deletePeriodo,
} from "../../services/Tricel/periodos.service";
import {Table,TableBody,TableCell,TableContainer,
  TableHead,TableRow,Paper,Button,} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import PeriodoForm from "../../components/Tricel/PeriodoForm";
import DeletePeriodoModal from "../../components/DeletePeriodoModal";
import EditPeriodoModal from "../../components/Tricel/EditPeriodoModal";
import { format, toZonedTime } from "date-fns-tz";
import { formatInTimeZone } from "date-fns-tz";
import {  parseISO, addHours, subHours } from "date-fns";
import { enGB } from 'date-fns/locale';

const PeriodosElectivos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [openPeriodoModal, setOpenPeriodoModal] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const data = await getPeriodos();
        if (data.length === 0) {
          setError("No se encontraron períodos electivos.");
        } else {
          setPeriodos(data);
        }
      } catch (err) {
        setError("Ocurrió un error al cargar los períodos electivos.");
      }
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

  const handleEditPeriodo = (periodo) => {
    setSelectedPeriodo(periodo);
    setEditModalOpen(true); 
  };

  
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    
    // Get day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();
  
    // Format the date
    return `${day}-${month}-${year}`;
  };



  return (
    <div style={{ overflow: "auto" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreatePeriodoModal}
      >
        Crear Nuevo Periodo
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Nombre del Periodo</TableCell>
              <TableCell align="center">Fecha de Inicio</TableCell>
              <TableCell align="center">Fecha de Fin</TableCell>
              <TableCell align="center">Duración (días)</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodos.length > 0 ? (
              periodos.map((periodo) => (
                <TableRow key={periodo._id}>
                  <TableCell align="center">{periodo.nombre_etapa}</TableCell>
                  <TableCell align="center">
                  {formatDateToDDMMYYYY(periodo.fechaInicio)}
                  </TableCell>
                  <TableCell align="center">
                  {formatDateToDDMMYYYY(periodo.fechaFin)}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron períodos electivos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PeriodoForm
        open={openPeriodoModal}
        onClose={handleClosePeriodoModal}
        fetchPeriodos={async () => {
          const data = await getPeriodos();
          setPeriodos(data || []);
        }}
      />

      <EditPeriodoModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        periodoId={selectedPeriodo?._id}
        currentFechaInicio={selectedPeriodo?.fechaInicio}
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
