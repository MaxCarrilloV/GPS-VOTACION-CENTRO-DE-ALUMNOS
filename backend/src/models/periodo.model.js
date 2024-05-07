"use strict";
const mongoose = require("mongoose");
const PERIODOS = require("../constants/periodos.constants");

// Etapas o periodos dentro de un proceso electivo.
/* Periodo de postulaciones, de revisión, de votación, etc. 
   (artículos 28-32)*/

const periodoSchema = new mongoose.Schema({
  nombre_etapa: {
    type: String,
    required: true,
    enum: PERIODOS.map((periodo) => periodo.nombre_etapa),
  },

  fechaInicio: {
    type: Date,
    required: true,
  },

  procesoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proceso",
    required: true,
    unique: true,
  },

  // automáticamente calculada
  fechaFin: {
    type: Date,
    required: true,
  },

  duracion: {
    type: Number,
    required: true,
    enum: PERIODOS.map((periodo) => periodo.duracion),
  },

  //orden o secuencia de etapas
  numero_etapa: {
    type: Number,
    required: true,
    enum: PERIODOS.map((periodo) => periodo.numero_etapa),
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const Periodo = mongoose.model("Periodo", periodoSchema);
module.exports = Periodo;
