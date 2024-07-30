"use strict"

const Actividad = require("../models/actividadCEE.model.js");
const Constants = require("../constants/actividades.constants.js");
const { handleError } = require("../utils/errorHandler.js");
const notificacionService = require("./notificacion.service.js");
const cron = require("node-cron");

const soloLetras = /^[a-zA-Z\s]+$/;
const letrasYNumeros = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/;
const letrasNumerosYDosPuntos = /^[a-zA-Z0-9\s:]+$/;

async function getActividades() {
    try {
        const actividades = await Actividad.find();
        if (actividades.length === 0)
        return [null, "No hay actividades registradas"];
    
        return [actividades, null];
    } catch (error) {
        handleError(error, "actividades.service -> getActividades");
    }
}

async function getActividadById(actividadId) {
    try {
        const actividad = await Actividad.findById(actividadId);
        if (!actividad) return [null, "La actividad no existe"];

        return [actividad, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> getActividadById");
    }
}

async function createActividad(actividad) {
    try {
        const { nombre, descripcion, fecha, hora, lugar, tipo } = actividad;

        if (soloLetras.test(nombre) === false) return [null, "El nombre solo puede contener letras"];
        if (letrasNumerosYDosPuntos.test(descripcion) === false) return [null, "La descripción solo puede contener letras, números y dos puntos"];
        if (fecha < new Date()) return [null, "La fecha no puede ser anterior a la actual"];

        const mesActual = new Date().getMonth();
        const mesActividad = new Date(fecha).getMonth();

        if (mesActividad < mesActual + 1) return [null, "La fecha no puede ser mayor a un mes de la actual"];

        if (letrasYNumeros.test(lugar) === false) return [null, "El lugar solo puede contener letras y números"];

        const newActividad = new Actividad({
            nombre,
            descripcion,
            fecha,
            hora,
            lugar,
            tipo,
        });
        await newActividad.save();
        await notificacionService.notificationActividad(newActividad);

        return [newActividad, null];
    } catch (error) {
        handleError(error, "actividades.service -> createActividad");
    }
}

async function updateActividad(actividadId, actividad) {
    try {
        const updatedActividad = await Actividad.findByIdAndUpdate (actividadId, actividad, {
            new: true,
        });
        if (!updatedActividad) return [null, "La actividad no existe"];

        return [updatedActividad, null];
    } catch (error) {
        handleError(error, "actividades.service -> updateActividad");
    }
}

cron.schedule("0 0 * * *", async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const result = await Actividad.updateMany(
            { fecha: { $lt: yesterday }, completado: false },
            { completado: true }
        );
    } catch (error) {
        handleError(error, "actividades.service -> cron.schedule");
    }
});

async function deleteActividad(actividadId) {
    try {
        const deletedActividad = await Actividad.findByIdAndDelete(actividadId);
        if (!deletedActividad) return [null, "La actividad no existe"];

        return [deletedActividad, null];
    } catch (error) {
        handleError(error, "actividades.service -> deleteActividad");
    }
}

module.exports = {
    getActividades,
    getActividadById,
    createActividad,
    updateActividad,
    deleteActividad,
};
