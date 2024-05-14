"use strict";

const express = require("express");
const postulacionController = require("../controllers/postulacion.controller.js");
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const router = express.Router();
router.use(authenticationMiddleware);

//multer para subir archivos
const {
  uploadPdf,
  handleMulterError,
} = require("../utils/fileUploadHandler.js");

// Define las rutas para las postulaciones
router.get("/", postulacionController.getPostulaciones);
router.post(
  "/",
  uploadPdf.single("programa_trabajo"),
  handleMulterError,
  authorizationMiddleware.isApoderadoCee,
  postulacionController.createPostulacion,
);
router.delete(
  "/:id",
  authorizationMiddleware.isApoderadoCee,
  postulacionController.deletePostulacion,
);

module.exports = router;
