"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Lista de POSTULANTES a cee.
//ej: Lista A, Lista B, Lista C, etc.

const postulacionSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxLenght: 100,
  },

  letra: {
    type: String,
    maxLenght: 1,
  },

  //Id de los estudiantes que conforman la lista
  presidenteId: {
    type: Schema.ObjectId,
    ref: "User",
    //   required: true,
  },
  vicepresidenteId: {
    type: Schema.ObjectId,
    ref: "User",
    //  required: true,
  },
  secretario_generalId: {
    type: Schema.ObjectId,
    ref: "User",
    //  required: true,
  },
  secretario_finanzasId: {
    type: Schema.ObjectId,
    ref: "User",
    ///  required: true,
  },
  apoderadoId: {
    type: Schema.ObjectId,
    ref: "User",
    //  required: true,
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
    enum: ["Enviado", "Aceptado", "Rechazado", "Se debe modificar"],
    default: "Sin enviar",
  },

  procesoId: {
    type: Schema.ObjectId,
    ref: "Proceso",
    required: true,
  },

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

const Postulacion = mongoose.model("Postulacion", postulacionSchema);
module.exports = Postulacion;
