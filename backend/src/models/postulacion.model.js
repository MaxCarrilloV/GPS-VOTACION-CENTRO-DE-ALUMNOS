"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//modelo tentativo de lista de POSTULANTES a cee

/**
  Art. 28 = Cada lista debe presentar un presidente, un vicepresidente, un secretario general, un secretario de finanzas, junto con un apoderado quien los representará ante Tricel durante el proceso de elección. EL apoderado de la lista es el encargado de rellenar el formulario de postulación y el único que puede retirar la postulación.

  Cada candidatura deberá ir acompañada de su programa de trabajo.

  Cada lista podrá tener hasta dos miembros de primer año, serán adjuntos a alguna(s) vocalía(s).
 */

  //Falta el campo de vocalias

const postulacionSchema = new Schema({
  //ej: Lista A, Lista B, Lista C, etc.
  // debe ser automático y único.
  nombre: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  //el id de estudiante
  presidenteId: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },

  //el id de estudiante
  vicepresidente: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },

  //el id de estudiante
  secretario_general: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },

  //el id de estudiante
  secretario_finanzas: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },

  //el id de estudiante
  apoderado: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },

  //pdf con el programa de trabajo
  programa_trabajo: {
    type: String,
    required: true,
    maxLenght: 500,
  },

  //estado de la postulación
  estado: {
    type: String,
    required: true,
    "enum": ["Enviado", "Aceptado", "Rechazado", "Se debe modificar", ],
    default: "Sin enviar",
  },

  //para mantener un historial de postulaciones
  fechaPostulacion: {
    type: Date,
    default: Date.now(),
    required: true,
  },

  //se puede modificar la postulación dentro de los 5 días habiles
  fechaModificacion: {
    type: Date,
  },
});

module.exports = mongoose.model("Postulacion", postulacionSchema);
