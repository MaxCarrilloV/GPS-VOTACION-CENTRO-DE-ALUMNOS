import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Grid, IconButton } from '@mui/material';
import PlusIcon from '@mui/icons-material/Plus';


import avisoService from "../services/Tricel/aviso.service";

const Avisos = () => {
    const [avisos, setAvisos] = useState([]);
    const [actividades, setActividades] = useState([]);
    
    useEffect(() => {
        const fetchAvisos = async () => {
        try {
            const { data } = await avisoService.getAllAdvices();
            const avisosOrdenados = data.data.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
            setAvisos(avisosOrdenados);
        } catch (error) {
            console.error("Error al obtener los avisos:", error);
        }
        };
        fetchAvisos();

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
    const [aviso, setAviso] = useState({
        titulo: '',
        tipo: '',
        contenido: ''
    });

    const tiposDeAviso = [
        { valor: 'Inscripción de listas', etiqueta: 'Inscripción de listas' },
        { valor: 'Apertura de votaciones', etiqueta: 'Apertura de votaciones' },
        { valor: 'Cierre de votaciones', etiqueta: 'Cierre de votaciones' },
        { valor: 'Resultados', etiqueta: 'Resultados' }
    ];

    const handleChange = (e) => {
        setAviso({ ...aviso, [e.target.name]: e.target.value });
    };

    const abrirDialogo = () => {
        setAbierto(true);
    };

    const cerrarDialogo = () => {
        setAbierto(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(aviso);
        // Aquí puedes agregar la lógica para enviar el aviso a tu backend o manejarlo según necesites
        cerrarDialogo();
    };
    return (
        <Grid container>
            <Grid item xs={10}>
            </Grid>
            <Grid item xs={2}>
                <Grid container direction="column" spacing={2} alignItems="flex-end">
                    <Grid item>
                        <h1>Actividades</h1>
                            <List>
                                {actividades.map((actividad) => (
                                    <ListItem key={actividad._id}>
                                        <ListItemText primary={actividad.titulo} secondary={actividad.descripcion} />
                                    </ListItem>
                                ))}
                            </List>
                    </Grid>
                    <Grid item>
                        <h1>Avisos</h1>
                        <IconButton variant="outlined" onClick={abrirDialogo} aria-label="crear aviso">
                            <PlusIcon />
                        </IconButton>
            <Dialog open={abierto} onClose={cerrarDialogo}>
                <DialogTitle>Crear un nuevo aviso</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="titulo"
                            name="titulo"
                            label="Título"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={aviso.titulo}
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
                            value={aviso.tipo}
                            onChange={handleChange}
                        >
                            {tiposDeAviso.map((opcion) => (
                                <MenuItem key={opcion.valor} value={opcion.valor}>
                                    {opcion.etiqueta}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            id="contenido"
                            name="contenido"
                            label="Contenido"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="standard"
                            value={aviso.contenido}
                            onChange={handleChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogo}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </DialogActions>
            </Dialog>
                            <List>
                                {avisos.map((aviso) => (
                                    <ListItem key={aviso._id}>
                                        <ListItemText primary={aviso.titulo} secondary={aviso.contenido} />
                                    </ListItem>
                                ))}
                            </List>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Avisos;