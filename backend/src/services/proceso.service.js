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
    const semester = new Date().getMonth() < 6 ? 1 : 2;

    const month = new Date().getMonth();
    if (month < 2) {
      return [
        null,
        "No se puede crear un proceso en los meses de enero y febrero",
      ];
    }

    const procesoFound = await Proceso.findOne({ finalizado: false });
    if (procesoFound) {
      return [
        null,
        "Ya existe un proceso en curso, finalícelo para poder crear uno nuevo",
      ];
    }

    const newProceso = new Proceso({
      nombre: nombre,
      year: year,
      semester: semester,
    });
    await newProceso.save();

    return [newProceso, null];
  } catch (error) {
    handleError(error, "proceso.service -> createProceso");
  }
}

async function deleteProceso(id) {
  try {
    const procesoFound = await Proceso.findById(id);
    if (!procesoFound)
      return [null, "El proceso no existe o no fue encontrado"];

    if (procesoFound.finalizado)
      return [null, "No se puede eliminar un proceso que ya ha sido finalizado"];

    if (procesoFound.periodos.length > 0)
      return [null, "No se puede eliminar un proceso con periodos asociados"];

    const deletedProceso = await Proceso.findByIdAndDelete(id);
    if (!deletedProceso) return [null, "No se pudo eliminar el proceso"];

    return [deletedProceso, null];
  } catch (error) {
    handleError(error, "proceso.service -> deleteProceso");
  }
}

module.exports = {
  getProcesos,
  createProceso,
  deleteProceso,
};
