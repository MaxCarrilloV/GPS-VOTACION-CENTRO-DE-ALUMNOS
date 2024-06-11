"use strict"

const express = require("express");
const actividadCEEController = require("../controllers/actividadCEE.controller.js");

const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const router = express.Router();
router.use(authenticationMiddleware);

router.get("/", authorizationMiddleware.isMiembroCee, actividadCEEController.getActividades);
router.get("/:id", authorizationMiddleware.isMiembroCee, actividadCEEController.getActividadById);

router.post("/", authorizationMiddleware.isMiembroCee, actividadCEEController.createActividad);

router.put("/:id", authorizationMiddleware.isMiembroCee, actividadCEEController.updateActividad);

router.delete("/:id", authorizationMiddleware.isMiembroCee, actividadCEEController.deleteActividad);

module.exports = router;