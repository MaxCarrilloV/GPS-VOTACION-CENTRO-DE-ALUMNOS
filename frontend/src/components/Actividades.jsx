import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import avisoService from "../services/Tricel/aviso.service";
import { useAuth } from "../context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";

const Actividades = () => {

    const [actividades, setActividades] = useState([]);

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const { data } = await avisoService.getAllActivities();
                const actividadesOrdenadas = data.data.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
                setActividades(actividadesOrdenadas);
            } catch (error) {
                console.error("Error al obtener las actividades:", error);
            }
            };
            fetchActividades();

    }, []);

    const [abierto, setAbierto] = useState(false);
    const [actividad, setActividad] = useState({
        nombre: '',
        descripcion: '',
        fecha: '',
        lugar: '',
        tipo: ''
    });

    const tiposDeActividad = [
        { valor: 'Asamblea ordinaria', etiqueta: 'Asamblea ordinaria' },
        { valor: 'asamblea extraordinaria', etiqueta: 'asamblea extraordinaria' },
        { valor: 'asamblea urgente', etiqueta: 'asamblea urgente' }
    ];

    const handleChange = (e) => {
        setActividad({ ...actividad, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setActividad({ ...actividad, fecha: date });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(actividad);
        avisoService.createActivity(actividad);
        cerrarDialogo();
    };

    const { user } = useAuth();
    const tieneRolAdecuado = user.roles[0].name === "Miembro de Tricel" || user.roles[0].name === "admin";

    const abrirDialogo = () => {
        setAbierto(true);
    };

    const cerrarDialogo = () => {
        setAbierto(false);
    };

    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <h1>Actividades</h1>
                </Grid>
                {tieneRolAdecuado && (
                    <Grid item>
                        <IconButton onClick={abrirDialogo} aria-label="crear actividad">
                            <AddIcon />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        <Dialog open={abierto} onClose={cerrarDialogo}>
                <DialogTitle>Crear una nueva actividad</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nombre"
                            name="nombre"
                            label="Nombre"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={actividad.nombre}
                            onChange={handleChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="descripcion"
                            name="descripcion"
                            label="Descripción"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={actividad.descripcion}
                            onChange={handleChange}
                        />
                        <DatePicker
                            label="Fecha"
                            onChange={handleDateChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="lugar"
                            name="lugar"
                            label="Lugar"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={actividad.lugar}
                            onChange={handleChange}
                        />
                        <TextField
                            select
                            margin="dense"
                            id="tipo"
                            name="tipo"
                            label="Tipo"
                            fullWidth
                            variant="standard"
                            value={actividad.tipo}
                            onChange={handleChange}
                        >
                            {tiposDeActividad.map((opcion) => (
                                <MenuItem key={opcion.valor} value={opcion.valor}>
                                    {opcion.etiqueta}
                                </MenuItem>
                            ))}
                        </TextField>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogo}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </DialogActions>
            </Dialog>
        <List>
            {actividades.map(actividad => (
                <ListItem key={actividad._id}>
                    <ListItemText primary={actividad.nombre} secondary={actividad.descripcion} />
                </ListItem>
            ))}
        </List>
            </LocalizationProvider>
        </>
    );

}

export default Actividades;