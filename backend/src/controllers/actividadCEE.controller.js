"use strict"

const ActividadService = require("../services/actividadCEE.service");
const ActividadSchema = require("../schema/actividadCEE.schema");
const { respondSuccess, respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");

async function getActividades(req, res) {
    try {
        const [actividades, errorActividades] = await ActividadService.getActividades();
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        actividades.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, actividades);
    } catch (error) {
        handleError(error, "actividades.controller -> getActividades");
        respondError(req, res, 400, error.message);
    }
}

async function getActividadById(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = ActividadSchema.actividadIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [actividad, errorActividad] = await ActividadService.getActividadById(params.id);
        if (errorActividad) return respondError(req, res, 404, errorActividad);

        respondSuccess(req, res, 200, actividad);
    } catch (error) {
        handleError(error, "actividades.controller -> getActividadById");
        respondError(req, res, 400, error.message);
    }
}

async function createActividad(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = ActividadSchema.actividadCEEBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [newActividad, actividadError] = await ActividadService.createActividad(body);

        if (actividadError) return respondError(req, res, 400, actividadError);
        if (!newActividad) {
            return respondError(req, res, 400, "No se creo la actividad");
        }

        respondSuccess(req, res, 201, newActividad);
    } catch (error) {
        handleError(error, "actividades.controller -> createActividad");
        respondError(req, res, 500, "No se creo la actividad");
    }
}

async function updateActividad(req, res) {
    try {
        const { params, body } = req;
        const { error: paramsError } = ActividadSchema.actividadIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = ActividadSchema.actividadBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [updatedActividad, actividadError] = await ActividadService.updateActividad(params.id, body);

        if (actividadError) return respondError(req, res, 400, actividadError);
        if (!updatedActividad) {
            return respondError(req, res, 400, "No se actualizo la actividad");
        }

        respondSuccess(req, res, 200, updatedActividad);
    } catch (error) {
        handleError(error, "actividades.controller -> updateActividad");
        respondError(req, res, 500, "No se actualizo la actividad");
    }
}

async function deleteActividad(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = ActividadSchema.actividadIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [deletedActividad, actividadError] = await ActividadService.deleteActividad(params.id);

        if (actividadError) return respondError(req, res, 400, actividadError);
        if (!deletedActividad) {
            return respondError(req, res, 400, "No se elimino la actividad");
        }

        respondSuccess(req, res, 200, deletedActividad);
    } catch (error) {
        handleError(error, "actividades.controller -> deleteActividad");
        respondError(req, res, 500, "No se elimino la actividad");
    }
}

module.exports = {
    getActividades,
    getActividadById,
    createActividad,
    updateActividad,
    deleteActividad,
};