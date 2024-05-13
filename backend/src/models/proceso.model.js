"use strict";
const e = require("express");
const { required } = require("joi");
const mongoose = require("mongoose");

// Proceso de elecciones, consta de etapas (art. 32)
// También funciona como historial

const procesoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    vueltas: {
      type: Number,
      required: true,
      default: 0,
      enum: [0, 1, 2],
    },
    finalizado: {
      type: Boolean,
      required: true,
      default: false,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    periodos: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Periodo",
        },
      ],
      default: [],
      required: true,
    },
    postulaciones: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Postulacion",
        },
      ],
      default: [],
      required: true,
    },
  },
  { versionKey: false },
);

const Proceso = mongoose.model("Proceso", procesoSchema);
module.exports = Proceso;
