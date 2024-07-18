import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormHelperText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { createPeriodo } from "../services/Tricel/periodos.service";
import { getProcesos } from "../services/Tricel/procesos.service";
import toast from "react-hot-toast";

const PERIODOS = [
  { nombre_etapa: "Periodo de postulaciones", duracion: 5, numero_etapa: 1 },
  { nombre_etapa: "Periodo de revisión", duracion: 2, numero_etapa: 2 },
  { nombre_etapa: "Periodo de información y propaganda", duracion: 5, numero_etapa: 3 },
  { nombre_etapa: "Periodo preparatorio para votación", duracion: 2, numero_etapa: 4 },
  { nombre_etapa: "Acto de votación", duracion: 2, numero_etapa: 5 },
  { nombre_etapa: "Conteo de votos y análisis de resultados", duracion: 1, numero_etapa: 6 },
  { nombre_etapa: "Publicación de resultados", duracion: 1, numero_etapa: 7 },
  { nombre_etapa: "Segunda vuelta de votación", duracion: 2, numero_etapa: 8 },
  { nombre_etapa: "Publicación de resultados de segunda vuelta", duracion: 1, numero_etapa: 9 },
];

const PeriodoForm = ({ open, onClose, fetchPeriodos }) => {
  const [nombreEtapa, setNombreEtapa] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [procesoId, setProcesoId] = useState(null);
  const [procesoNombre, setProcesoNombre] = useState("");
  const [errors, setErrors] = useState({ nombreEtapa: false, fechaInicio: false });

  useEffect(() => {
    const fetchProcesos = async () => {
      const procesos = await getProcesos();

      const activeProceso = procesos.find((proceso) => !proceso.finalizado);
      if (activeProceso) {
        setProcesoId(activeProceso._id);
        setProcesoNombre(activeProceso.nombre);
      } else {
        setModalMessage("No existe un proceso electivo vigente");
      }
    };

    fetchProcesos();
  }, []);

  const handleSubmitPeriodo = async () => {
    const newErrors = { nombreEtapa: false, fechaInicio: false };

    if (!nombreEtapa) newErrors.nombreEtapa = true;
    if (!fechaInicio) newErrors.fechaInicio = true;

    setErrors(newErrors);

    if (!nombreEtapa || !fechaInicio || !procesoId) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    // Convertir fechaInicio de "dd-mm-yyyy" a "yyyy-mm-dd"
    const [day, month, year] = fechaInicio.split("-");
    const formattedFechaInicio = `${year}-${month}-${day}`;

    const newPeriodo = {
      nombre_etapa: nombreEtapa,
      fechaInicio: formattedFechaInicio,
      procesoId,
    };

    try {
      const response = await createPeriodo(newPeriodo);

      if (response.status && response.status !== 200) {
        setModalMessage(response.data.message);
        toast.error(response.data.message);
      } else {
        setModalMessage("");
        fetchPeriodos();
        handleClose();
        toast.success("Periodo creado exitosamente!");
      }
    } catch (error) {
      toast.error("Ocurrió un error al crear el periodo.");
    }
  };

  const handleClose = () => {
    setNombreEtapa("");
    setFechaInicio("");
    setModalMessage("");
    setErrors({ nombreEtapa: false, fechaInicio: false });
    onClose();
  };

  const handleBack = () => {
    setModalMessage("");
    setErrors({ nombreEtapa: false, fechaInicio: false });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Crear Nuevo Periodo
        </Typography>
        {modalMessage ? (
          <>
            <Typography variant="subtitle1" component="div" color="error">
              {modalMessage}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              style={{ marginTop: "20px" }}
            >
              Volver
            </Button>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" component="div" sx={{ mb: 2 }}>
              Proceso en curso: {procesoNombre}
            </Typography>
            <Select
              value={nombreEtapa}
              onChange={(e) => setNombreEtapa(e.target.value)}
              fullWidth
              displayEmpty
              margin="normal"
              error={errors.nombreEtapa}
            >
              <MenuItem value="" disabled>
                Seleccionar nombre del periodo
              </MenuItem>
              {PERIODOS.map((periodo) => (
                <MenuItem key={periodo.numero_etapa} value={periodo.nombre_etapa}>
                  {periodo.nombre_etapa}
                </MenuItem>
              ))}
            </Select>
            {errors.nombreEtapa && (
              <FormHelperText error>Campo obligatorio</FormHelperText>
            )}
            <TextField
              label="Fecha de Inicio (dd-mm-yyyy)"
              name="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              fullWidth
              margin="normal"
              error={errors.fechaInicio}
              placeholder="dd-mm-yyyy"
            />
            {errors.fechaInicio && (
              <FormHelperText error>Campo obligatorio</FormHelperText>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitPeriodo}
              style={{ marginTop: "20px" }}
            >
              Crear
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PeriodoForm;
