"use strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");

const PostulacionService = require("../services/postulacion.service");
const PostulacionSchema = require("../schema/postulacion.schema");

async function getPostulaciones(req, res) {
  try {
    const [postulaciones, errorPostulaciones] =
      await PostulacionService.getPostulaciones();
    if (errorPostulaciones)
      return respondError(req, res, 404, errorPostulaciones);

    postulaciones.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, postulaciones);
  } catch (error) {
    handleError(error, "postulacion.controller -> getPostulaciones");
    respondError(req, res, 400, error.message);
  }
}

async function createPostulacion(req, res) {
  try {
    const { body } = req;
    const file = req.file.filename;
    
    const { error: bodyError } =
      PostulacionSchema.postulacionBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const { error: fileError } =
      PostulacionSchema.postulacionFileSchema.validate({
        file,
      });
    if (fileError) return respondError(req, res, 400, fileError.message);

    const [newPostulacion, postulacionError] =
      await PostulacionService.createPostulacion(body, file);

    if (postulacionError) return respondError(req, res, 400, postulacionError);
    if (!newPostulacion) {
      return respondError(req, res, 400, "No se creo la postulacion");
    }

    respondSuccess(req, res, 201, newPostulacion);
  } catch (error) {
    if (!req.file?.filename) {
      return respondError(req, res, 401, "No se ha subido ningún archivo");
    }
    handleError(error, "postulacion.controller -> createPostulacion");
    respondError(req, res, 500, "No se creo la postulacion");
  }
}

async function updatePostulacion(req, res) {
  try {
    const { body, params } = req;


    const updatedPostulacion = await PostulacionService.updatePostulacion(
      params.id,
      body,
    );

    if (!updatedPostulacion) {
      return respondError(
        req,
        res,
        400,
        "La postulación no fue actualizada correctamente",
      );
    }
    respondSuccess(req, res, 200, updatedPostulacion);
  } catch (error) {
    handleError(error, "postulacion.controller -> updatePostulacion");
    respondError(req, res, 500, "No se actualizo la postulacion");
  }
}


async function deletePostulacion(req, res) {
  try {
    const { params } = req;
    const { error } = PostulacionSchema.postulacionIdSchema.validate(params);
    if (error) return respondError(req, res, 400, error.message);

    const deletedPostulacion = await PostulacionService.deletePostulacion(
      params.id,
    );

    if (!deletedPostulacion) {
      return respondError(
        req,
        res,
        400,
        "La postulación no fue eliminada correctamente",
      );
    }
    respondSuccess(req, res, 200, deletedPostulacion);
  } catch (error) {
    handleError(error, "postulacion.controller -> deletePostulacion");
    respondError(req, res, 500, "No se elimino la postulacion");
  }
}

module.exports = { getPostulaciones, createPostulacion,updatePostulacion, deletePostulacion };
