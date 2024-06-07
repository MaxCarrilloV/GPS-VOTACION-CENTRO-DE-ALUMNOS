"use strict";

const mongoose = require("mongoose");

const ACTIVIDADES = require("../constants/actividades.constants");

const actividadCEESchema = new mongoose.Schema(
    {
        nombre: {
        type: String,
        required: true,
        maxLength: 100,
        },
        descripcion: {
        type: String,
        required: true,
        maxLength: 500,
        },
        fecha: {
        type: Date,
        required: true,
        },
        lugar: {
        type: String,
        required: true,
        maxLength: 100,
        },
        completado: {
        type: Boolean,
        required: false,
        default: false,
        },
        tipo: {
        type: String,
        enum: ACTIVIDADES,
        required: true,
        },
    },
    {
        versionKey: false,
    },
    );

const ActividadCEE = mongoose.model("Actividad", actividadCEESchema);

module.exports = ActividadCEE;