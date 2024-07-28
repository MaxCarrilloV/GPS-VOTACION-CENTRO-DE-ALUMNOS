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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 
import toast, { Toaster } from "react-hot-toast"; 
import { createPeriodo } from "../../services/Tricel/periodos.service";
import { getProcesos } from "../../services/Tricel/procesos.service";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const PERIODOS = [
  { nombre_etapa: "Periodo de postulaciones", duracion: 5, numero_etapa: 1 },
  { nombre_etapa: "Periodo de revisión", duracion: 2, numero_etapa: 2 },
  {
    nombre_etapa: "Periodo de información y propaganda",
    duracion: 5,
    numero_etapa: 3,
  },
  {
    nombre_etapa: "Periodo preparatorio para votación",
    duracion: 2,
    numero_etapa: 4,
  },
  { nombre_etapa: "Acto de votación", duracion: 2, numero_etapa: 5 },
  {
    nombre_etapa: "Conteo de votos y análisis de resultados",
    duracion: 1,
    numero_etapa: 6,
  },
  { nombre_etapa: "Publicación de resultados", duracion: 1, numero_etapa: 7 },
  { nombre_etapa: "Segunda vuelta de votación", duracion: 2, numero_etapa: 8 },
  {
    nombre_etapa: "Publicación de resultados de segunda vuelta",
    duracion: 1,
    numero_etapa: 9,
  },
];

const PeriodoForm = ({ open, onClose, fetchPeriodos }) => {
  // Añadido onSuccess
  const [nombreEtapa, setNombreEtapa] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [procesoId, setProcesoId] = useState(null);
  const [procesoNombre, setProcesoNombre] = useState("");
  const [errors, setErrors] = useState({
    nombreEtapa: false,
    fechaInicio: false,
  });

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
    if (!nombreEtapa || !fechaInicio) {
      setErrors({
        nombreEtapa: !nombreEtapa,
        fechaInicio: !fechaInicio,
      });
      return;
    }

    const timeZone = "America/Santiago";
    const zonedDate = toZonedTime(fechaInicio, timeZone);
    const formattedFechaInicio = format(zonedDate, "dd-MM-yyyy", { timeZone });

    const periodo = {
      nombre_etapa: nombreEtapa,
      fechaInicio: formattedFechaInicio,
      procesoId: procesoId,
    };

    try {
      console.log(periodo);
      const response = await createPeriodo(periodo);

      if (response.status === 200 || response.status === 201) {
        // Si la creación es exitosa
        toast.success("Periodo creado con éxito.", {
          duration: 2000,
          isClosable: true,
        });

        onClose();
        fetchPeriodos();
      } else {
        // Si ocurre un error
        const errorMessage =
          response.data?.message || "Error al crear el periodo";
        toast.error(`Error: ${errorMessage}`, {
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error inesperado.";
      toast.error(`Error: ${errorMessage}`, {
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setNombreEtapa("");
    setFechaInicio("");
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
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {modalMessage ? (
          <>
            <Typography variant="subtitle1" component="div">
              {modalMessage}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{ mt: 2 }}
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
              margin="dense"
              error={errors.nombreEtapa}
            >
              <MenuItem value="" disabled>
                Seleccionar nombre del periodo
              </MenuItem>
              {PERIODOS.map((periodo) => (
                <MenuItem
                  key={periodo.numero_etapa}
                  value={periodo.nombre_etapa}
                >
                  {periodo.nombre_etapa}
                </MenuItem>
              ))}
            </Select>
            {errors.nombreEtapa && (
              <FormHelperText error>Campo obligatorio</FormHelperText>
            )}
            <TextField
              label="Fecha de Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.fechaInicio}
              helperText={errors.fechaInicio && "Campo obligatorio"}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitPeriodo}
              sx={{ mt: 2 }}
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
