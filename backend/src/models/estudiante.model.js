"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cargos = require("../constants/cargos.constants");

//modelo tentativo de estudiante
const EstudianteSchema = new Schema({
  nombre_completo: {
    type: String,
    required: true,
    maxLength: 100,
  },
  cargo: {
    type: String,
    required: true,
    maxLength: 100,
    enum: Cargos,
    default: "Sin cargo",
  },
});

module.exports = mongoose.model("Estudiante", EstudianteSchema);
