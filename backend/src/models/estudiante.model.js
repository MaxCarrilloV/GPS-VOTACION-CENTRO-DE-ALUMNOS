"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROLES = require("../constants/roles.constants");

//modelo tentativo de estudiante
//si hay algo malo, por favor corregirlo
// de userId se saca el correo

const EstudianteSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  nombre_completo: {
    type: String,
    required: true,
    maxLength: 100,
  },
  rut: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    maxLength: 100,
    enum: ROLES,
    default: "Sin cargo",
  },

  //sanciones?
  /**Si ta sancionao no puede postular ningun cargo */
});

module.exports = mongoose.model("Estudiante", EstudianteSchema);
