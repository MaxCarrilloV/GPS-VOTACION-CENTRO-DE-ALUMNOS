"use strict";
const express = require("express");

const procesoController = require("../controllers/proceso.controller");

const authorizationMiddleware = require("../middlewares/authorization.middleware");
const authenticationMiddleware = require("../middlewares/authentication.middleware");

const router = express.Router();
router.use(authenticationMiddleware);

router.get("/", procesoController.getProcesos);
router.post(
  "/",
  authorizationMiddleware.isTricelorAdmin,
  procesoController.createProceso,
);
router.put(
  "/finalizado/:id",
  authorizationMiddleware.isTricelorAdmin,
  procesoController.updateFinalizadoProceso,
);
router.delete(
  "/:id",
  authorizationMiddleware.isTricelorAdmin,
  procesoController.deleteProceso,
);

module.exports = router;
