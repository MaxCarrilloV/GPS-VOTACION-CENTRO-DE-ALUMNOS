"use strict";

const Postulacion = require("../models/postulacion.model.js");
const Proceso = require("../models/proceso.model.js");
const ProcesoService = require("./proceso.service");
const { handleError } = require("../utils/errorHandler");
const { PORT, HOST } = require("../config/configEnv.js");
const fs = require("fs");
const path = require("path");

async function getPostulaciones() {
  try {
    const postulaciones = await Postulacion.find();
    if (postulaciones.length == 0) return [null, "No hay postulaciones"];

    return [postulaciones, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getPostulaciones");
  }
}

async function createPostulacion(postulacion, programa_trabajo) {
  try {
    const {
      nombre,
      /* presidenteId,
      vicepresidenteId,
      secretario_generalId,
      secretario_finanzasId,
      apoderadoId, */
      estado,
      procesoId,
    } = postulacion;

    // Validar que el proceso exista y no haya finalizado
    const [proceso, error] = await ProcesoService.getProcesoById(procesoId);
    if (error) return [proceso, error];
    if (proceso.finalizado) return [null, "El proceso ha finalizado"];

    // Validar que el proceso esté en la etapa de postulaciones

    const url = `http:/${HOST}:${PORT}/api/postulacion/uploads/${programa_trabajo}`;

    const newPostulacion = new Postulacion({
      nombre: nombre,
      /*  presidenteId: presidenteId,
      vicepresidenteId: vicepresidenteId,
      secretario_generalId: secretario_generalId,
      secretario_finanzasId: secretario_finanzasId,
      apoderadoId: apoderadoId, */
      programa_trabajo: url,
      estado: estado,
      procesoId: procesoId,
    });
    const postulacionCreated = await newPostulacion.save();
    if (!postulacionCreated) return [null, "Error al crear la postulacion"];

    // Agregar la postulación al proceso
    proceso.postulaciones.push(postulacionCreated._id);
    await proceso.save();

    return [newPostulacion, null];
  } catch (error) {
    handleError(error, "postulacion.service -> createPostulacion");
  }
}

async function deletePostulacion(id) {
  try {
    const postulacionFound = await Postulacion.findById(id);
    if (!postulacionFound) return [null, "La postulacion no existe"];

    // Eliminar la postulación del proceso
    const proceso = await Proceso.findByIdAndUpdate(
      { _id: postulacionFound.procesoId },
      { $pull: { postulaciones: id } },
      { new: true },
    );
    if (!proceso)
      return [null, "No se pudo eliminar la postulación del proceso"];

    // eliminar el archivo de programa de trabajo
    const filename = postulacionFound.programa_trabajo.split("/").pop();
    const pathFile = path.join(__dirname, `../../public/uploads/${filename}`);
    fs.unlink(pathFile, (err) => {
      if (err) {
        console.error("Error al eliminar el archivo:", err);
      } else {
        console.log("Archivo eliminado exitosamente");
      }
    });

    const postulacionDeleted = await Postulacion.findByIdAndDelete(id);
    if (!postulacionDeleted) return [null, "La postulación no fue eliminada"];

    return [postulacionDeleted, filename, null];
  } catch (error) {
    handleError(error, "postulacion.service -> deletePostulacion");
  }
}

module.exports = {
  getPostulaciones,
  createPostulacion,
  deletePostulacion,
};
