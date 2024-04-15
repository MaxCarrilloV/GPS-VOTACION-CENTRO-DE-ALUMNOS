"use strict";
const Periodo = require("../models/periodo.model.js");
const { PERIODOS } = require("../utils/constants");
const { handleError } = require("../utils/errorHandler");

async function getPeriodos() {
  try {
    const periodos = await Periodo.find();
    if (!periodos)
      return [null, "No hay periodos o etapas electivas registradas"];

    return [periodos, null];
  } catch (error) {
    handleError(error, "periodo.service -> getPeriodos");
  }
}

async function createPeriodo(periodo) {
  try {
    const { nombre_etapa, fecha_inicio } = periodo;

    //verificar si el periodo electivo ya existe
    const periodoFound = await Periodo.findOne({ nombre_etapa });
    if (periodoFound) return [null, "El periodo ya existe"];

    const duracion = PERIODOS.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).duracion;

    const numero_etapa = PERIODOS.find(
      (periodo) => periodo.nombre_etapa === nombre_etapa,
    ).numero_etapa;

    const newPeriodo = new Periodo({
      nombre_etapa,
      fecha_inicio,
      fecha_fin: new Date(
        fecha_inicio.getTime() + duracion * 24 * 60 * 60 * 1000,
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
    const { nombre_etapa, fecha_inicio, duracion } = periodo;

    const updatedPeriodo = await Periodo.findByIdAndUpdate(
      id,
      {
        nombre_etapa,
        fecha_inicio,
        fecha_fin: new Date(
          fecha_inicio.getTime() + duracion * 24 * 60 * 60 * 1000,
        ),
        duracion,
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
    const deletedPeriodo = await Periodo.findByIdAndDelete(id);

    return [deletedPeriodo, null];
  } catch (error) {
    handleError(error, "periodo.service -> deletePeriodo");
  }
}

module.exports = { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo };
