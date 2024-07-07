import react,{useEffect,useMemo,useState}  from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getVotaciones, deleteVotacion } from '../services/votacion.service'; // Asegúrate de que esta ruta es correcta y de que el servicio está correctamente implementado
import { Button, Stack, TextField, Alert, Snackbar,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const columns =  [
  { field: 'titulo', headerName: 'Nombre', width: 150  },
  { field: 'descripcion', headerName: 'Descripción', width: 150 },
  { field: 'fechaInicio', headerName: 'Fecha inicio', width: 100 },
  { field: 'fechaFin', headerName: 'Fecha fin', width: 100 },
  {
    field: 'resultados',
    headerName: 'Resultados',
    sortable: false,
    width: 200,
    renderCell: (params) => (
      <div>
        <Button variant="contained" color="info" onClick={() => handleVer(params.row.id)}>Resultados</Button>
      </div>
    ),
  },
  {
    field: 'acciones',
    headerName: 'Acciones',
    sortable: false,
    width: 270,
    renderCell: (params) => (
      <div>
        <Button variant="contained" color="primary" onClick={() => handleVer(params.row.id)}>Ver</Button>
        <Button style={{marginInline:2}} variant="contained" color="warning" onClick={() => handleEditar(params.row.id)}>Editar</Button>
        <Button variant="contained" color="error" onClick={() => openConfirmDialog(params.row.id,params.row.titulo)}>Eliminar</Button>
      </div>
    ),
  },
];



export default function Votacion() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ id: null, titulo: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const votaciones = await getVotaciones();
        const formattedData = votaciones.map(votacion => ({
          id: votacion._id,
          titulo: votacion.titulo,
          descripcion: votacion.descripcion,
          fechaInicio: new Date(votacion.fechaInicio).toLocaleString(),
          fechaFin: new Date(votacion.fechaFin).toLocaleString(),
        }));
        setRows(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching votaciones:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleResultados = (id) => {
    // Lógica para ver los resultados de la votación con el ID proporcionado
    console.log(`Ver resultados de la votación con ID ${id}`);
  }

  const handleVer = (id) => {
    // Lógica para ver la votación con el ID proporcionado
    console.log(`Ver votación con ID ${id}`);
  };

  const handleEditar = (id) => {
    // Lógica para editar la votación con el ID proporcionado
    console.log(`Editar votación con ID ${id}`);
  };

  const handleEliminar = async () => {
    const { id, titulo } = deleteInfo;
    const success = await deleteVotacion(id);
    if (success) {
      setRows((prevRows) => prevRows.filter(row => row.id !== id));
      setSnackbarMessage(`Votación "${titulo}" eliminada correctamente`);
      setSnackbarSeverity('success');
      handleDialogClose();
    } else {
      setSnackbarMessage(`Error al eliminar la votación "${titulo}"`);
      setSnackbarSeverity('error');
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
      if (column.field === 'acciones') {
        return {
          ...column,
          renderCell: (params) => (
            <div>
              <Button variant="contained" color="primary" onClick={() => handleVer(params.row.id)}>Ver</Button>
              <Button style={{marginInline:2}} variant="contained" color="warning" onClick={() => handleEditar(params.row.id)}>Editar</Button>
              <Button variant="contained" color="error" onClick={() => openConfirmDialog(params.row.id,params.row.titulo)}>Eliminar</Button>
            </div>
          )
        };
      }
      return column;
    });
  }, [rows]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredRows = rows.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div style={{ height: 400, width: '75%', marginInline:220, marginBlock:150 }}>
      <Snackbar
        className=''
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Stack direction="row" justifyContent="space-between">
        <h1>Votaciones</h1>
        <TextField
            label="Buscador"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            style={{ marginBlock: '1rem' }}
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
      <Dialog
        open={confirmDialogOpen}
        onClose={handleDialogClose}
      >
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar la votación "{deleteInfo.titulo}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEliminar} color="error">Eliminar</Button>
          <Button onClick={handleDialogClose} color="success">Cancelar</Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}
