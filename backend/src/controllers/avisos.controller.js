"use strict"

const AvisoService = require("../services/avisos.service");
const AvisoSchema = require("../schema/avisos.schema");
const { respondSuccess, respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");

async function getAvisos(req, res) {
    try {
        const [avisos, errorAvisos] = await AvisoService.getAvisos();
        if (errorAvisos) return respondError(req, res, 404, errorAvisos);

        avisos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, avisos);
    } catch (error) {
        handleError(error, "avisos.controller -> getAvisos");
        respondError(req, res, 400, error.message);
    }
}

async function getAvisoById(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = AvisoSchema.avisoIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [aviso, errorAviso] = await AvisoService.getAvisoById(params.id);
        if (errorAviso) return respondError(req, res, 404, errorAviso);

        respondSuccess(req, res, 200, aviso);
    } catch (error) {
        handleError(error, "avisos.controller -> getAvisoById");
        respondError(req, res, 400, error.message);
    }
}

async function createAviso(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = AvisoSchema.avisosBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [newAviso, avisoError] = await AvisoService.createAviso(body);

        if (avisoError) return respondError(req, res, 400, avisoError);
        if (!newAviso) {
            return respondError(req, res, 400, "No se creo el aviso");
        }

        respondSuccess(req, res, 201, newAviso);
    } catch (error) {
        handleError(error, "avisos.controller -> createAviso");
        respondError(req, res, 500, "No se creo el aviso");
    }
}

async function updateAviso(req, res) {
    try {
        const { params, body } = req;
        const { error: paramsError } = AvisoSchema.avisoIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [updatedAviso, avisoError] = await AvisoService.updateAviso(params.id, body);

        if (avisoError) return respondError(req, res, 400, avisoError);
        if (!updatedAviso) {
            return respondError(req, res, 400, "No se actualizo el aviso");
        }

        respondSuccess(req, res, 200, updatedAviso);
    } catch (error) {
        handleError(error, "avisos.controller -> updateAviso");
        respondError(req, res, 500, "No se actualizo el aviso");
    }
}

async function deleteAviso(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = AvisoSchema.avisosIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [deletedAviso, avisoError] = await AvisoService.deleteAviso(params.id);

        if (avisoError) return respondError(req, res, 400, avisoError);
        if (!deletedAviso) {
            return respondError(req, res, 400, "No se elimino el aviso");
        }

        respondSuccess(req, res, 200, deletedAviso);
    } catch (error) {
        handleError(error, "avisos.controller -> deleteAviso");
        respondError(req, res, 500, "No se elimino el aviso");
    }
}

module.exports = {
    getAvisos,
    getAvisoById,
    createAviso,
    updateAviso,
    deleteAviso,
};

