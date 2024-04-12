"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//modelo tentativo de lista
const ListaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  //presidente puede ser el id de estudiante
  presidente: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  //vicepresidente puede ser el id de estudiante
  vicepresidente: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  //secretario puede ser el id de estudiante
  secretario_general: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  //secretario de finanzas puede ser el id de estudiante
  secretario_finanzas: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  /**
   * Vocalías
   * vocalías de cualquier cosa, pueden ser n vocalías
   * cientificas, artisticas, deportivas, sociales,
   * gremiales, recreativas, etc.
   */
});

module.exports = mongoose.model("Lista", ListaSchema);
