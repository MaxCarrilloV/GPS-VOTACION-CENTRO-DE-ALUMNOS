"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");
const ProcesoService = require("../services/proceso.service");

async function getProcesos(req, res) {
  try {
    const [procesos, errorProcesos] = await ProcesoService.getProcesos();
    if (errorProcesos) return respondError(req, res, 404, errorProcesos);

    procesos.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, procesos);
  } catch (error) {
    handleError(error, "proceso.controller -> getProcesos");
    respondError(req, res, 400, error.message);
  }
}

async function createProceso(req, res) {
  try {
    const { body } = req;
    const [newProceso, procesoError] = await ProcesoService.createProceso(body);

    if (procesoError) return respondError(req, res, 400, procesoError);
    if (!newProceso) {
      return respondError(req, res, 400, "No se creó el proceso");
    }

    respondSuccess(req, res, 201, newProceso);
  } catch (error) {
    handleError(error, "proceso.controller -> createProceso");
    respondError(req, res, 500, "No se creó el proceso");
  }
}

async function deleteProceso(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [proceso, procesoError] = await ProcesoService.deleteProceso(
      params.id,
    );
    if (procesoError) return respondError(req, res, 400, procesoError);
    if (!proceso) {
      return respondError(req, res, 400, "No se eliminó el proceso");
    }

    respondSuccess(req, res, 200, proceso);
  } catch (error) {
    handleError(error, "proceso.controller -> deleteProceso");
    respondError(req, res, 500, "No se eliminó el proceso");
  }
}

module.exports = {
  getProcesos,
  createProceso,
  deleteProceso,
};
