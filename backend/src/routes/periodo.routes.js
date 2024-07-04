"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");
const periodoController = require("../controllers/periodo.controller.js");

const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const router = express.Router();
router.use(authenticationMiddleware);

// Define las rutas para los periodos api/periodo
router.get("/", periodoController.getPeriodos);
router.post(
  "/",
  authorizationMiddleware.isTricel,
  periodoController.createPeriodo,
);
router.put(
  "/:id",
  authorizationMiddleware.isTricel,
  periodoController.updatePeriodo,
);
router.delete(
  "/:id",
  authorizationMiddleware.isTricel,
  periodoController.deletePeriodo,
);

module.exports = router;
