import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';


import avisoService from "../services/Tricel/aviso.service";
import { useAuth } from "../context/AuthContext";

const Avisos = () => {
    const [avisos, setAvisos] = useState([]);

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


    function handleDeleteAviso(id) {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir la decisión!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, borrar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                avisoService.deleteAviso(id).then((response) => {
                    Swal.fire({
                        title: "Aviso borrado",
                        icon: "success",
                    });
                    setAvisos((prevAvisos) => {
                        return prevAvisos.filter((aviso) => aviso._id !== id);
                    });
                });
            }
        });
    }

    const abrirDialogo = () => {
        setAbierto(true);
    };

    const cerrarDialogo = () => {
        setAbierto(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(aviso);
        avisoService.createAdvice(aviso);
        cerrarDialogo();
    };



    const { user } = useAuth();
    const tieneRolAdecuado = user.roles[0].name === "Miembro de Tricel" || user.roles[0].name === "admin";



    return (
        <>
        <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <h1>Avisos</h1>
                </Grid>
                {tieneRolAdecuado && (
                    <Grid item>
                        <IconButton onClick={abrirDialogo} aria-label="crear aviso">
                            <AddIcon />
                        </IconButton>
                    <Grid item>
                    </Grid>
                    </Grid>
                )}
        </Grid>
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
                {avisos.map(aviso => (
                    <ListItem key={aviso._id}>
                        <ListItemText primary={aviso.titulo} secondary={aviso.contenido} />
                        {tieneRolAdecuado && (
                            <IconButton onClick={() => handleDeleteAviso(aviso._id)} aria-label="borrar aviso">
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </ListItem>
                ))}
            </List>
        </>
    );
};


export default Avisos;