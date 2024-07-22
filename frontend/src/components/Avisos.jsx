import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import avisoService from "../services/Tricel/aviso.service";
import { Grid, Stack } from "@mui/material";

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
    
    return (
        <Grid container>
            <Grid item xs={8}>
            </Grid>
            <Grid item xs={4}>
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