"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//El tricel gestiona procesos electivos

const eleccionSchema = new Schema({
    //nombre de la eleccion
    nombre: {
        type: String,
        required: true,
        maxLenght: 100,
    },
    
    //fecha de inicio de la eleccion
    fecha_inicio: {
        type: Date,
        required: true,
    },
    
    //fecha de termino de la eleccion
    fecha_termino: {
        type: Date,
        required: true,
    },
    
    //tipo de eleccion
    tipo: {
        type: String,
        required: true,
        maxLenght: 100,
    },
    
    //estado de la eleccion
    estado: {
        type: String,
        required: true,
        maxLenght: 100,
    },
    });

const Eleccion = mongoose.model("Eleccion", eleccionSchema);

module.exports = Eleccion;