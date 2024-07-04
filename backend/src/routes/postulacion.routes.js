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
const Role = require("../models/role.model.js");

// Define las rutas para las postulaciones
router.get("/", postulacionController.getPostulaciones);
router.post(
  "/",
  uploadPdf.single("programa_trabajo"),
  handleMulterError,
  authorizationMiddleware.hasRole("Apoderado de CEE"),
  postulacionController.createPostulacion,
);
router.delete(
  "/:id",
  authorizationMiddleware.hasRole("Apoderado de CEE"),
  postulacionController.deletePostulacion,
);

module.exports = router;
