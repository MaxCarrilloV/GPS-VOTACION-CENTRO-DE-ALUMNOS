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
  authorizationMiddleware.isTricel,
  procesoController.createProceso,
);
router.put(
  "/finalizado/:id",
  authorizationMiddleware.isTricel,
  procesoController.updateFinalizadoProceso,
);
router.delete(
  "/:id",
  authorizationMiddleware.isTricel,
  procesoController.deleteProceso,
);

module.exports = router;
