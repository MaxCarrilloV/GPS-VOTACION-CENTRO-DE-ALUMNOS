"use strict"

const express = require("express");
const actividadCEEController = require("../controllers/actividadCEE.controller.js");

const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const router = express.Router();
router.use(authenticationMiddleware);

router.get("/", authorizationMiddleware.isTricel, actividadCEEController.getActividades);
router.get("/:id", authorizationMiddleware.isTricel, actividadCEEController.getActividadById);

router.post("/", authorizationMiddleware.isTricel, actividadCEEController.createActividad);

router.put("/:id", authorizationMiddleware.isTricel, actividadCEEController.updateActividad);

router.delete("/:id", authorizationMiddleware.isTricel, actividadCEEController.deleteActividad);

module.exports = router;