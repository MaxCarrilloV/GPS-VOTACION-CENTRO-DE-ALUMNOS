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
    const votacionFound = await Votacion.findOne({ titulo });
    if (votacionFound) return [null, "La votacion ya existe"];

    if (opciones.length < 2) return [null, "Debe haber al menos dos opciones"];

    if (fechaInicio >= fechaFin) return [null, "La fecha de inicio debe ser menor a la fecha de fin"];

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
    const { titulo, descripcion, opciones, fechaInicio, fechaFin, estado } = votacion;

    const updatedVotacion = await Votacion.findByIdAndUpdate(  
        id,
        {
            titulo,
            descripcion,
            opciones,
            fechaInicio,
            fechaFin,
            estado
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

async function getVotacionById(id) {
    try {
        const votacion = await Votacion.findById(id);
        if (!votacion) return [null, "La votacion no existe"];
        return [votacion, null];
    } catch (error) {
        handleError(error, "votacion.service -> getVotacionById");
    }
}


async function votar(votacionId, voto) {
      try {
          const { votanteId, opcionIndex } = voto;
          const votacion = await Votacion.findById(votacionId);

          if (!votacion) {
             return { message: 'La votación no existe' };  
          }
          if (votacion.estado === 'cerrada') {
              return [null, "La votación ya termino"];
          }

          if (votacion.votantes.includes(votanteId)) {
              return [null, "Ya votaste en esta votación"]
          }
          const opciones = votacion.opciones;
          for (let i = 0; i < opciones.length; i++) {
              if (opciones[i]._id.toString() === opcionIndex){  
                  opciones[i].cantidadVotos++;
              }
          }
        votacion.opciones = opciones;
        votacion.votantes.push(votanteId);

        await votacion.updateOne(votacion);
        return [votacion, null];
      } catch (error) {
          handleError(error, "votacion.service -> votar");
      }
  }

async function resultadoVotacion(votacionId) {
      try {
         console.log(votacionId);
          const votacion = await Votacion.findById(votacionId);

          if (!votacion) {
              throw new Error('La votación no existe');
          }

          return votacion.opciones;
      } catch (error) {
          throw error;
      }
  }

module.exports = {
    getVotaciones,
    createVotacion,
    updateVotacion,
    deleteVotacion,
    getVotacionById,
    votar,
    resultadoVotacion,
};