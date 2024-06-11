"use strict";
const mongoose = require("mongoose");

const votacionSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    opciones: [{
        opcion: {
            type: String,
            required: true
        },
        cantidadVotos: {
            type: Number,
            default: 0
        }
    }],
    votantes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['abierta', 'cerrada'],
        default: 'abierta'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

const Votacion = mongoose.model('Votacion', votacionSchema );

module.exports = Votacion;