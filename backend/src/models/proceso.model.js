"use strict";
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
    vueltas: {
      type: Number,
      required: true,
      default: 1,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

const Proceso = mongoose.model("Proceso", procesoSchema);
module.exports = Proceso;
