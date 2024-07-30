"use strict";
const Votacion = require("../models/votacion.model.js");
const { handleError } = require("../utils/errorHandler");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");

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

    if (opciones.length > 6) return [null, "No puede haber más de cinco opciones"];

    //validar que el titulo contega solo letra y numeros tabien el espacio y el punto y que se permita solo letras
    const regexTitulo = /^[a-zA-Z0-9 .áéíóúÁÉÍÓÚñÑüÜ]+$/;
    const soloLetrasTitulo = /^[a-zA-Z .áéíóúÁÉÍÓÚñÑüÜ]+$/;
    const contieneLetraTitulo = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(titulo);

    if (!contieneLetraTitulo || (!regexTitulo.test(titulo) && !soloLetrasTitulo.test(titulo))) {
      return [null, "El título solo puede contener letras con: números, espacios y puntos"];
    }

    //validar que la descripcion contega solo letra y numeros tabien el espacio punto
    
    const regexDescripcion = /^[a-zA-Z0-9 .áéíóúÁÉÍÓÚñÑüÜ]+$/;
    const soloLetrasDescripcion = /^[a-zA-Z .áéíóúÁÉÍÓÚñÑüÜ]+$/;
    const contieneLetraDescripcion = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(descripcion);

    if (!contieneLetraDescripcion || (!regexDescripcion.test(descripcion) && !soloLetrasDescripcion.test(descripcion))) {
      return [null, "La descripción solo puede contener letras con: números, espacios y puntos"];
    }

    for (const opcion of opciones) {
        const regexOpcion = /^[a-zA-Z0-9 .áéíóúÁÉÍÓÚñÑüÜ]+$/;
        const soloLetrasOpcion = /^[a-zA-Z .áéíóúÁÉÍÓÚñÑüÜ]+$/;
        const contieneLetraOpcion = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(opcion.opcion);
    
        if (!contieneLetraOpcion || (!regexOpcion.test(opcion.opcion) && !soloLetrasOpcion.test(opcion.opcion))) {
            return [null, "La opción solo puede contener letras, números, espacios y puntos"];
        }
    }

    const fechaActual = new Date();
    const offset = fechaActual.getTimezoneOffset();
    fechaActual.setTime(fechaActual.getTime() - offset * 60 * 1000);

    //la fecha de inicio no debe superar los 5 dias
    const fechaInicioLimite = new Date(fechaActual);
    fechaInicioLimite.setDate(fechaInicioLimite.getDate() + 5);
    const inicio = new Date(fechaInicio);
    const Fin = new Date(fechaFin);

    if (inicio <= fechaActual) return [null, "La fecha de inicio debe ser mayor a la fecha actual"];

    if (Fin <= fechaActual) return [null, "La fecha de fin debe ser menor a la fecha actual"];

    if (fechaInicio >= fechaFin) return [null, "La fecha de inicio debe ser menor a la fecha de fin"];


    if (fechaInicioLimite < inicio) return [null, "La fecha de inicio no debe superar los 5 días"];

    //la fecha de fin no debe superar a la fecha de inicio por mas de 5 dias
    const fechaFinLimite = new Date(fechaInicio);
    fechaFinLimite.setDate(fechaFinLimite.getDate() + 5);
  
    if (fechaFinLimite < Fin) return [null, "La fecha de fin no debe superar los 5 días de la fecha de inicio"];

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
    let { titulo, descripcion, opciones, fechaInicio, fechaFin, estado } = votacion;

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

          const votante = await User.findById(votanteId);
          console.log(votante.roles);
          const role = await Role.findById(votante.roles[0]);
          if (role.name !== 'user') {
              return [null, "No tienes permisos para votar"];
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
