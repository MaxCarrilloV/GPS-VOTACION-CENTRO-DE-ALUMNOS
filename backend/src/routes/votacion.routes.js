"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de votaciones */
const votacionController = require("../controllers/votacion.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para las votaciones
router.get("/",  votacionController.getVotaciones);
router.post("/", authorizationMiddleware.isAdmin || authorizationMiddleware.isTricel, votacionController.createVotacion);
/* router.get("/:id", votacionController.getVotacionById); */
router.put(
  "/:id",
  authorizationMiddleware.isAdmin || authorizationMiddleware.isTricel,
  votacionController.updateVotacion,
);
router.delete(
  "/:id",
  authorizationMiddleware.isAdmin || authorizationMiddleware.isTricel,
  votacionController.deleteVotacion,
);
router.put("/:id/votar", votacionController.votar);
router.get("/:id/resultados", votacionController.resultadoVotacion);

module.exports = router;