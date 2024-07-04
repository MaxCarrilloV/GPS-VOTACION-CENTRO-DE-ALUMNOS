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

// validar que nombre no se repita en el proceso
async function validateName(nombre, procesoId) {
  try {
    const postulaciones = await Postulacion.find({ procesoId: procesoId });
    for (let postulacion of postulaciones) {
      const nombreSinPrefijo = postulacion.nombre.split(" - ")[1]; 
      if (nombreSinPrefijo === nombre) return false;
    }
    return true;
  } catch (error) {
    handleError(error, "postulacion.service -> validateName");
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

    const url = `http:/${HOST}:${PORT}/api/postulacion/uploads/${programa_trabajo}`;

    // Validar que el proceso exista y esté en la etapa de postulaciones
    const [proceso, error] = await ProcesoService.getProcesoById(procesoId);
    if (error) return [proceso, error];
    if (proceso.finalizado) return [null, "El proceso ha finalizado"];
    if (proceso.periodos.length > 1 || proceso.periodos.length == 0)
      return [null, "El proceso no está en la etapa de postulaciones"];

    // Validar que el nombre no se repita en el proceso
    const uniqueName = await validateName(nombre, procesoId);
    if (!uniqueName) return [null, "El nombre ya está en uso"];

    // Asignar nombre de lista y letra
    const Letras = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const indice = proceso.postulaciones.length;
    const letra = Letras[indice];

    const newPostulacion = new Postulacion({
      nombre: `Lista ${letra} - ${nombre}`,
      letra: letra,
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
