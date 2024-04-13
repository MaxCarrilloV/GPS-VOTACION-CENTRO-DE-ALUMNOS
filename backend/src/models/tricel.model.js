"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//modelo tentativo de tricel
/**
 * Tribunal calificador de elecciones
 * constituido por , a lo menos, 1 persona(s) (alumnos regulares de la carrera) [Art. 21]
 *
 */

const tricelSchema = new Schema({
  //miembros del tricel
  miembros: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  //presidente del tricel
  presidente: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports = mongoose.model("Tricel", tricelSchema);
