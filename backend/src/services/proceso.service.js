"use strict";
const Proceso = require("../models/proceso.model.js");
const { handleError } = require("../utils/errorHandler");

async function getProcesos() {
  try {
    const procesos = await Proceso.find();
    if (procesos.length === 0)
      return [null, "No hay procesos electivos registrados"];

    return [procesos, null];
  } catch (error) {
    handleError(error, "proceso.service -> getProcesos");
  }
}

async function createProceso(proceso) {
  try {
    const { nombre } = proceso;
    const year = new Date().getFullYear();

    const newProceso = new Proceso({
      nombre: nombre,
      year: year,
    });
    await newProceso.save();

    return [newProceso, null];
  } catch (error) {
    handleError(error, "proceso.service -> createProceso");
  }
}

async function deteleProceso(id) {
  try {
    const proceso = await Proceso.findByIdAndDelete(id);
    if (!proceso) return [null, "El proceso no existe"];

    return [proceso, null];
  } catch (error) {
    handleError(error, "proceso.service -> deleteProceso");
  }
}

module.exports = {
  getProcesos,
  createProceso,
  deteleProceso,
};
