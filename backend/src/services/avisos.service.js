"use strict"

const Aviso = require("../models/avisos.model.js");
const Constants = require("../constants/avisos.constants.js");
const { handleError } = require("../utils/errorHandler");
const notificacionService = require("./notificacion.service.js");
const cron = require("node-cron");

const soloLetras = /^[a-zA-Z\s]+$/;
const letrasYNumeros = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/;
const letrasNumerosYDosPuntos = /^[a-zA-Z0-9\s:]+$/;

async function getAvisos() {
    try {
        const avisos = await Aviso.find();
        if (avisos.length === 0)
        return [null, "No hay avisos registrados"];
    
        return [avisos, null];
    } catch (error) {
        handleError(error, "avisos.service -> getAvisos");
    }
}

async function getAvisoById(avisoId) {
    try {
        const aviso = await Aviso.findById(avisoId);
        if (!aviso) return [null, "El aviso no existe"];
    
        return [aviso, null];
    } catch (error) {
        handleError(error, "avisos.service -> getAvisoById");
    }
}

async function createAviso(aviso) {
    try {
        const { titulo, tipo, contenido } = aviso;

        if (soloLetras.test(titulo) === false) return [null, "El título solo puede contener letras"];
        if (letrasNumerosYDosPuntos.test(contenido) === false) return [null, "El contenido solo puede contener letras, números y dos puntos"];

        const newAviso = new Aviso({
            titulo,
            tipo,
            contenido,
            fechaPublicacion: new Date(),
        });
        await newAviso.save();
        await notificacionService.notificationAviso(newAviso);
        
        return [newAviso, null];
    } catch (error) {
        handleError(error, "avisos.service -> createAviso");
    }
}

async function updateAviso(avisoId, aviso) {
    try {
        const updatedAviso = await Aviso.findByIdAndUpdate(avisoId, aviso, {
            new: true,
        });
        if (!updatedAviso) return [null, "El aviso no existe"];
    
        return [updatedAviso, null];
    } catch (error) {
        handleError(error, "avisos.service -> updateAviso");
    }
}

cron.schedule("0 0 * * *", async () => {
    try {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const avisos = await Aviso.deleteMany({ fechaPublicacion: { $lt: twoMonthsAgo } });
        if (avisos.length === 0) return;
    } catch (error) {
        handleError(error, "avisos.service -> cron.schedule");
    }
});

async function deleteAviso(avisoId) {
    try {
        const deletedAviso = await Aviso.findByIdAndDelete(avisoId);
        if (!deletedAviso) return [null, "El aviso no existe"];
    
        return [deletedAviso, null];
    } catch (error) {
        handleError(error, "avisos.service -> deleteAviso");
    }
}

module.exports = {
    getAvisos,
    getAvisoById,
    createAviso,
    updateAviso,
    deleteAviso,
};