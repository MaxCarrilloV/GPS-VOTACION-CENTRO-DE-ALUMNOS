"use strict";
const Periodo = require("../models/periodo.model.js");
const Proceso = require("../models/proceso.model.js");
const Constants = require("../constants/periodos.constants.js");
const { handleError } = require("../utils/errorHandler");

async function getPeriodos() {
  try {
    const periodos = await Periodo.find();
    if (periodos.length === 0)
      return [null, "No hay periodos electivos registrados"];

    return [periodos, null];
  } catch (error) {
    handleError(error, "periodo.service -> getPeriodos");
  }
}

async function createPeriodo(periodo) {
  try {
    const { nombre_etapa, fechaInicio, procesoId } = periodo;

    let fechaInicioDate = new Date(fechaInicio);

    const duracion = Constants.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).duracion;

    const numero_etapa = Constants.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).numero_etapa;

    const proceso = await Proceso.findById(procesoId);
    if (!proceso) return [null, "El proceso no existe"];

    console.log("El periodo `${nombre_etapa}` ya existe dentro del proceso: '${proceso.nombre}'");

    // Verificar si el periodo electivo ya existe dentro del proceso
    const periodoFound = await Periodo.findOne({
      nombre_etapa: nombre_etapa,
      procesoId: procesoId,
    });
    if (periodoFound)
      return [
        null,
        "El periodo `${nombre_etapa}` ya existe dentro del proceso: '${proceso.nombre}'",
      ];


    //verificar secuencia de etapas
    if (numero_etapa !== 1) {
      const periodoPrevio = await Periodo.findOne({
        numero_etapa: numero_etapa - 1,
      });

      if (!periodoPrevio) return [null, "La secuencia de etapas es incorrecta"];
    }

    const newPeriodo = new Periodo({
      nombre_etapa,
      fechaInicio: fechaInicioDate,
      fechaFin: new Date(
        fechaInicioDate.getTime() + duracion * 24 * 60 * 60 * 1000,
      ),
      duracion,
      numero_etapa,
    });
    await newPeriodo.save();

    return [newPeriodo, null];
  } catch (error) {
    handleError(error, "periodo.service -> createPeriodo");
  }
}

//---- update y delete necesarios?

async function updatePeriodo(id, periodo) {
  try {
    const { nombre_etapa, fechaInicio } = periodo;
    let fechaInicioDate = new Date(fechaInicio);

    const duracion = Constants.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).duracion;

    const numero_etapa = Constants.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).numero_etapa;

    const updatedPeriodo = await Periodo.findByIdAndUpdate(
      id,
      {
        nombre_etapa,
        fechaInicioDate,
        fechaFin: new Date(
          fechaInicioDate.getTime() + duracion * 24 * 60 * 60 * 1000,
        ),
        duracion,
        numero_etapa,
      },
      { new: true },
    );

    return [updatedPeriodo, null];
  } catch (error) {
    handleError(error, "periodo.service -> updatePeriodo");
  }
}

async function deletePeriodo(id) {
  try {
    const periodoFound = await Periodo.findById(id);
    if (!periodoFound) return [null, "El periodo no existe"];

    const deletedPeriodo = await Periodo.findByIdAndDelete(id);

    return [deletedPeriodo, null];
  } catch (error) {
    handleError(error, "periodo.service -> deletePeriodo");
  }
}

module.exports = { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo };
