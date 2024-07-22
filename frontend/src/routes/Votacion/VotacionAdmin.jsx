import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getVotaciones, deleteVotacion } from "../../services/votacion.service";
import VotacionEditForm from "../../components/VotacionEditForm";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Stack,
  TextField,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  Modal,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const columns = [
  { field: "titulo", headerName: "Nombre", width: 150 },
  { field: "descripcion", headerName: "Descripción", width: 150 },
  { field: "fechaInicio", headerName: "Fecha inicio", width: 200 },
  { field: "fechaFin", headerName: "Fecha fin", width: 200 },
  { field: "estado", headerName: "Estado", width: 100 },
  {
    field: "resultados",
    headerName: "Resultados",
    sortable: false,
    width: 200,
    renderCell: (params) => (
      <Box>
        <Button
          variant="contained"
          color="info"
          onClick={() => handleResultados(params.row.id)}
        >
          Resultados
        </Button>
      </Box>
    ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    sortable: false,
    width: 230,
    renderCell: (params) => (
      <Box>
        <Button
          style={{ marginInline: 2 }}
          variant="contained"
          color="warning"
          onClick={() => handleEditar(params.row.id)}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => openConfirmDialog(params.row.id, params.row.titulo)}
        >
          Eliminar
        </Button>
      </Box>
    ),
  },
];

export default function VotacionAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ id: null, titulo: "" });
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedVotacion, setSelectedVotacion] = useState();
  const [openResultados, setOpenResultados] = useState(false);
  const navigate = useNavigate();
  const [totalVotos, setTotalVotos] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      user.roles[0].name !== "admin" &&
      user.roles[0].name !== "Miembro de Tricel" &&
      user.roles[0].name !== "Presidente de Tricel"
    ) {
      navigate("/");
    }
    async function fetchData() {
      try {
        const votaciones = await getVotaciones();
        const formattedData = votaciones.map((votacion) => ({
          id: votacion._id,
          titulo: votacion.titulo,
          descripcion: votacion.descripcion,
          fechaInicio: new Date(votacion.fechaInicio).toLocaleString(),
          fechaFin: new Date(votacion.fechaFin).toLocaleString(),
          opciones: votacion.opciones,
          estado: votacion.estado,
        }));
        setRows(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching votaciones:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleResultados = (id) => {
    const votacion = rows.find((row) => row.id === id);
    const total = votacion.opciones.reduce(
      (acc, opcion) => acc + opcion.cantidadVotos,
      0
    );
    console.log(total);
    if (total === 0) {
      setSnackbarMessage("No hay votos registrados para esta votación");
      setSnackbarSeverity("primary");
      setSnackbarOpen(true);
      return;   
    }
    setTotalVotos(total);
    votacion.opciones.map((opcion) => {
      opcion.porcentaje = `${((opcion.cantidadVotos / total) * 100).toFixed(
        2
      )}%`;
    });
    setSelectedVotacion(votacion);
    setOpenResultados(true);
  };

  useEffect(() => {
    if (selectedVotacion) {
      console.log(selectedVotacion);
    }
  }, [selectedVotacion]);


  const closeResultados = () => {
    setOpenResultados(false);
  };

  const handleEditar = (id) => {
    const votacion = rows.find((row) => row.id === id);
    setSelectedVotacion(votacion);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedVotacion(null);
  };

  const handleEliminar = async () => {
    const { id, titulo } = deleteInfo;
    const success = await deleteVotacion(id);
    if (success) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setSnackbarMessage(`Votación "${titulo}" eliminada correctamente`);
      setSnackbarSeverity("success");
      handleDialogClose();
    } else {
      setSnackbarMessage(`Error al eliminar la votación "${titulo}"`);
      setSnackbarSeverity("error");
      handleDialogClose();
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const openConfirmDialog = (id, titulo) => {
    setDeleteInfo({ id, titulo });
    setConfirmDialogOpen(true);
  };

  const renderColumns = useMemo(() => {
    return columns.map((column) => {
      if (column.field === "resultados") {
        return {
          ...column,
          renderCell: (params) => (
            <Box>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleResultados(params.row.id)}
              >
                Resultados
              </Button>
            </Box>
          ),
        };
      }
      if (column.field === "acciones") {
        return {
          ...column,
          renderCell: (params) => (
            <Box>
              <Button
                style={{ marginInline: 2 }}
                variant="contained"
                color="success"
                onClick={() => handleEditar(params.row.id)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  openConfirmDialog(params.row.id, params.row.titulo)
                }
              >
                Eliminar
              </Button>
            </Box>
          ),
        };
      }
      return column;
    });
  }, [rows]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <Box style={{ height: 400 }}>
      <Snackbar
        className=""
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3">Votaciones</Typography>
        <TextField
          label="Buscador"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
          style={{ marginBlock: "1rem" }}
        />
      </Stack>
      <DataGrid
        rows={filteredRows}
        columns={renderColumns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
      <Dialog open={confirmDialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar la votación "{deleteInfo.titulo}
            "?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEliminar} color="error">
            Eliminar
          </Button>
          <Button onClick={handleDialogClose} color="success">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <VotacionEditForm
        open={openEditForm}
        onClose={handleCloseEditForm}
        votacion={selectedVotacion}
      />
      <Modal open={openResultados} onClose={closeResultados}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            borderRadius: 5,
            boxShadow: 24,
            transform: "translate(-50%, -50%)",
            p: 4,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Resultados {selectedVotacion?.titulo}
            </Typography>
            <IconButton onClick={closeResultados} >
              <CloseIcon />
            </IconButton>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              border: "1px solid #e0e0e0", 
              borderRadius: 3,
              marginBottom: 5,
            }}
          >
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  border: "1px solid #e0e0e0",
                  borderRadius: 10,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Opción</TableCell>
                  <TableCell>Cantidad Votos</TableCell>
                  <TableCell>Porcentaje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedVotacion?.opciones?.map((opcion, index) => (
                  <TableRow key={index}>
                    <TableCell>{opcion.opcion}</TableCell>
                    <TableCell>{opcion.cantidadVotos}</TableCell>
                    <TableCell>{opcion.porcentaje}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6">
            Total de votos: {totalVotos} <br />
            Participacion Carrera: {(totalVotos/200)*100}% <br />
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
