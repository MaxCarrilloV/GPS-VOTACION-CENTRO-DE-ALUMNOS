import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avisoService from "../services/aviso.service";

const Avisos = () => {
    const [avisos, setAvisos] = useState([]);
    
    useEffect(() => {
        const fetchAvisos = async () => {
        try {
            const { data } = await avisoService.getAllAvisos();
            setAvisos(data);
        } catch (error) {
            console.error("Error al obtener los avisos:", error);
        }
        };
        fetchAvisos();
    }, []);
    
    return (
        <div>
        <h1>Avisos</h1>
        <ul>
            {avisos.map(aviso => (
            <li key={aviso._id}>
                <Link to={`/avisos/${aviso._id}`}>{aviso.title}</Link>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default Avisos;