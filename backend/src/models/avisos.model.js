const mongoose = require('mongoose');

const AVISOS = require('../constants/avisos.constants');

const avisosSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: AVISOS,
        required: true,
    },
    contenido: {
        type: String,
        required: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
});

const Avisos = mongoose.model('Aviso', avisosSchema);

module.exports = Avisos;