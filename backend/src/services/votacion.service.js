"use strict";
const Votacion = require("../models/votacion.model.js");
const { handleError } = require("../utils/errorHandler");

async function getVotaciones() {
  try {
    const votaciones = await Votacion.find();
    if (!votaciones)
      return [null, "No hay votaciones registradas"];

    return [votaciones, null];
  } catch (error) {
    handleError(error, "votacion.service -> getVotaciones");
  }
}

async function createVotacion(votacion) {
  try {
    const { titulo, descripcion, opciones, fechaInicio, fechaFin } = votacion;

    //verificar si la votacion ya existe
    const votacionFound = await Votacion.findOne({ titulo });
    if (votacionFound) return [null, "La votacion ya existe"];

    const newVotacion = new Votacion({
        titulo,
        descripcion,
        opciones,
        fechaInicio,
        fechaFin,
    });
    await newVotacion.save();

    return [newVotacion, null];
  } catch (error) {
    handleError(error, "votacion.service -> createVotacion");
  }
}

async function updateVotacion(id, votacion) {
  try {
    const { titulo, descripcion, opciones, fechaInicio, fechaFin } = votacion;

    const updatedVotacion = await Votacion.findByIdAndUpdate(  
        id,
        {
            titulo,
            descripcion,
            opciones,
            fechaInicio,
            fechaFin,
        },
        { new: true }
        );
        return [updatedVotacion, null];
    } catch (error) {
        handleError(error, "votacion.service -> updateVotacion");
    }
}

async function deleteVotacion(id) { 
    try {
        const deletedVotacion = await Votacion.findByIdAndDelete(id);
        if (!deletedVotacion) return [null, "La votacion no existe"];
        return [deletedVotacion, null];
    } catch (error) {
        handleError(error, "votacion.service -> deleteVotacion");
    }
}

class VotacionService {
  async votar(votacionId, opcionIndex, votanteId) {
      try {
          const votacion = await Votacion.findById(votacionId);

          if (!votacion) {
              throw new Error('La votación no existe');
          }

          if (votacion.votantes.includes(votanteId)) {
              throw new Error('El votante ya ha votado en esta votación');
          }
          votacion.opciones[opcionIndex].cantidadVotos++;

          votacion.votantes.push(votanteId);

          await votacion.save();

          return { message: 'Voto registrado exitosamente' };
      } catch (error) {
          throw error;
      }
  }
}
module.exports = {
    getVotaciones,
    createVotacion,
    updateVotacion,
    deleteVotacion,
    VotacionService,
};