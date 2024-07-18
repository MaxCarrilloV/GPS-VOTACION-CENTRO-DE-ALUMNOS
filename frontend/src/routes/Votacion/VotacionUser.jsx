import react, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getVotaciones, votarVotacion } from "../../services/votacion.service";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Box,
  Stack,
  Typography,
  TextField,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const columns = [
  { field: "titulo", headerName: "Nombre", width: 150 },
  { field: "descripcion", headerName: "Descripción", width: 250 },
  { field: "fechaInicio", headerName: "Fecha inicio", width: 250 },
  { field: "fechaFin", headerName: "Fecha fin", width: 200 },
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
    field: "Votar",
    headerName: "Votar",
    sortable: false,
    width: 150,
    renderCell: (params) => (
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => ModalVotar(params.row.id)}
        >
          Votar
        </Button>
      </Box>
    ),
  },
];
export default function VotacionUser() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [selectedVotacion, setSelectedVotacion] = useState(null);
  const [openVotar, setOpenVotar] = useState(false);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [openResultados, setOpenResultados] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.roles[0].name !== "user") {
      navigate("/");
    }
    async function fetchVotaciones() {
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
          votantes: votacion.votantes,
        }));
        setRows(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching votaciones:", error);
        setLoading(false);
      }
    }
    fetchVotaciones();
  }, []);

  useEffect(() => {
    if (selectedVotacion) {
      console.log(selectedVotacion);
    }
  }, [selectedVotacion]);

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
    votacion.opciones.map((opcion) => {
      opcion.porcentaje = `${((opcion.cantidadVotos / total) * 100).toFixed(
        2
      )}%`;
    });
    setSelectedVotacion(votacion);
    setOpenResultados(true);
  };

  const handleSelect = (opcion) => {
    setSelectedOption(opcion);
  };

  const closeResultados = () => {
    setOpenResultados(false);
  };

  const ModalVotar = (id) => {
    const votacion = rows.find((row) => row.id === id);
    if (votacion.estado === "cerrada") {
      setSnackbarMessage("La votación se encuentra cerrada");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    } else {
      const UserId = JSON.parse(localStorage.getItem("user")).Userid;
      if (votacion.votantes.includes(UserId)) {
        setSnackbarMessage(`Ya has votado en la votación ${votacion.titulo}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      } else {
        setSelectedVotacion(votacion);
        setOpenVotar(true);
      }
    }
  };

  const handleCloseVotar = () => {
    setSelectedOption(null);
    setSelectedVotacion(null);
    setOpenVotar(false);
  };

  const handleVotar = async (data) => {
    const payload = {
      votanteId: JSON.parse(localStorage.getItem("user")).Userid,
      opcionIndex: selectedOption,
    };
    votarVotacion(selectedVotacion.id, payload).then(([data, error]) => {
      if (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error al votar, " + error.message);
      } else {
        setSnackbarSeverity("success");
        setSnackbarMessage("Votación exitosa");
        handleCloseVotar();
        reset();
        setSelectedOption(null);
        setSelectedVotacion(null);
      }
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      if (column.field === "Votar") {
        return {
          ...column,
          renderCell: (params) => (
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => ModalVotar(params.row.id)}
              >
                Votar
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
            <IconButton onClick={closeResultados}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
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
                {selectedVotacion?.opciones.map((opcion, index) => (
                  <TableRow key={index}>
                    <TableCell>{opcion.opcion}</TableCell>
                    <TableCell>{opcion.cantidadVotos}</TableCell>
                    <TableCell>{opcion.porcentaje}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
      <Modal open={openVotar} onClose={handleCloseVotar}>
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            width: 1000,
            bgcolor: "background.paper",
            border: "2px solid #000",
            borderRadius: 5,
            boxShadow: 24,
            transform: "translate(-50%, -50%)",
            p: 4,
            "@media (max-width: 1000px)": {
              width: 700,
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Votar {selectedVotacion?.titulo}
            </Typography>
            <IconButton onClick={handleCloseVotar}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="form" onSubmit={handleSubmit(handleVotar)}>
            <Box
              sx={{
                marginInline: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <RadioGroup row>
                {selectedVotacion?.opciones.map((opcion, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedOption === opcion._id}
                        onChange={() => handleSelect(opcion._id)}
                      />
                    }
                    label={opcion.opcion}
                    labelPlacement="top"
                    sx={{ marginX: 2 }}
                    {...register("opcion", { required: true })}
                  />
                ))}
              </RadioGroup>
            </Box>
            {errors?.opcion && (
              <FormHelperText error sx={{ textAlign: "center" }}>
                Debe seleccionar una opción
              </FormHelperText>
            )}
            <Button type="submit" variant="contained" color="primary">
              Votar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
