"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const VotacionService = require("../services/votacion.service");
const {
  votacionBodySchema,
  votacionIdSchema,
} = require("../schema/votacion.schema");

async function getVotaciones(req, res) {
    try {
        const [votaciones, errorVotaciones] = await VotacionService.getVotaciones();
        if (errorVotaciones) return respondError(req, res, 404, errorVotaciones);
    
        votaciones.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, votaciones);
    } catch (error) {
        respondError(req, res, 400, error.message);
    }
}

async function createVotacion(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = votacionBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
    
        const [newVotacion, votacionError] = await VotacionService.createVotacion(body);
    
        if (votacionError) return respondError(req, res, 400, votacionError);
        if (!newVotacion) {
        return respondError(req, res, 400, "No se creo la votacion");
        }
    
        respondSuccess(req, res, 201, newVotacion);
    } catch (error) {
        respondError(req, res, 500, "No se creo la votacion");
    }
}

async function updateVotacion(req, res) {
    try {
        const { params, body } = req;
        const { error: paramsError } = votacionIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);
    
        const [updatedVotacion, votacionError] = await VotacionService.updateVotacion(
        params.id,
        body,
        );
    
        if (votacionError) return respondError(req, res, 400, votacionError);
        if (!updatedVotacion) {
        return respondError(req, res, 400, "No se actualizo la votacion");
        }
    
        respondSuccess(req, res, 200, updatedVotacion);
    } catch (error) {
        respondError(req, res, 500, "No se actualizo la votacion");
    }
}

async function deleteVotacion(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = votacionIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);
    
        const [deletedVotacion, votacionError] = await VotacionService.deleteVotacion(params.id);
    
        if (votacionError) return respondError(req, res, 400, votacionError);
        if (!deletedVotacion) {
        return respondError(req, res, 400, "No se elimino la votacion");
        }
    
        respondSuccess(req, res, 200, deletedVotacion);
    } catch (error) {
        respondError(req, res, 500, "No se elimino la votacion");
    }
}

async function votar(req, res, next){
    try {
        const { votacionId, opcionIndex, votanteId } = req.body;
        const resultado = await votacionService.votar(votacionId, opcionIndex, votanteId);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getVotaciones,
    createVotacion,
    updateVotacion,
    deleteVotacion,
    votar,
}