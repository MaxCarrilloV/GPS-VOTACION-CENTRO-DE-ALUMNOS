"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const PeriodoService = require("../services/periodo.service");
const {
  periodoBodySchema,
  periodoIdSchema,
} = require("../schema/periodo.schema");
const { handleError } = require("../utils/errorHandler");

async function getPeriodos(req, res) {
  try {
    const [periodos, errorPeriodos] = await PeriodoService.getPeriodos();
    if (errorPeriodos) return respondError(req, res, 404, errorPeriodos);

    periodos.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, periodos);
  } catch (error) {
    handleError(error, "periodo.controller -> getPeriodos");
    respondError(req, res, 400, error.message);
  }
}

async function createPeriodo(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = periodoBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newPeriodo, periodoError] = await PeriodoService.createPeriodo(body);

    if (periodoError) return respondError(req, res, 400, periodoError);
    if (!newPeriodo) {
      return respondError(req, res, 400, "No se creo el periodo");
    }

    respondSuccess(req, res, 201, newPeriodo);
  } catch (error) {
    handleError(error, "periodo.controller -> createPeriodo");
    respondError(req, res, 500, "No se creo el periodo");
  }
}

//---- update y delete necesarios?
async function updatePeriodo(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = periodoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [updatedPeriodo, periodoError] = await PeriodoService.updatePeriodo(
      params.id,
      body,
    );

    if (periodoError) return respondError(req, res, 400, periodoError);
    if (!updatedPeriodo) {
      return respondError(req, res, 400, "No se actualizo el periodo");
    }

    respondSuccess(req, res, 200, updatedPeriodo);
  } catch (error) {
    handleError(error, "periodo.controller -> updatePeriodo");
    respondError(req, res, 500, "No se actualizo el periodo");
  }
}

async function deletePeriodo(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = periodoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [deletedPeriodo, periodoError] = await PeriodoService.deletePeriodo(
      params.id,
    );

    if (periodoError) return respondError(req, res, 400, periodoError);
    if (!deletedPeriodo) {
      return respondError(req, res, 400, "No se elimino el periodo");
    }

    respondSuccess(req, res, 200, deletedPeriodo);
  } catch (error) {
    handleError(error, "periodo.controller -> deletePeriodo");
    respondError(req, res, 500, "No se elimino el periodo");
  }
}

module.exports = {
  getPeriodos,
  createPeriodo,
  updatePeriodo,
  deletePeriodo,
};
