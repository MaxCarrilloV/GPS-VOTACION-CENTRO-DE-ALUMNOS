"use strict"

const Actividad = require("../models/actividadCEE.model.js");
const Constants = require("../constants/actividades.constants.js");
const { handleError } = require("../utils/errorHandler.js");
const notificacionService = require("./notificacion.service.js");

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
