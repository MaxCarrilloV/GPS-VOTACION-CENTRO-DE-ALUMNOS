"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        ref: "User"
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
        enum: ['Abierta', 'Cerrada'],
        default: 'Abierta'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

votacionSchema.pre('updateOne', function(next) {
    const now = new Date();
    if (this.fechaFin < now) {
        this.estado = 'Cerrada';
    } else {
        this.estado = 'Abierta';
    }
    next();
});

const Votacion = mongoose.model('Votacion', votacionSchema );

module.exports = Votacion;