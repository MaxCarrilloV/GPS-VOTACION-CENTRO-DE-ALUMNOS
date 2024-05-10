"use strict";
const express = require("express");

const procesoController = require("../controllers/proceso.controller");

const authorizationMiddleware = require("../middlewares/authorization.middleware");
const authenticationMiddleware = require("../middlewares/authentication.middleware");

const router = express.Router();
router.use(authenticationMiddleware);

router.get("/", procesoController.getProcesos);
router.post("/", procesoController.createProceso);
router.put("/finalizado/:id", procesoController.updateFinalizadoProceso);
router.delete("/:id", procesoController.deleteProceso);

module.exports = router;
