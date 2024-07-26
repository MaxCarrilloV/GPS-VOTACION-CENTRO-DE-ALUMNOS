"use strict"

const express = require("express");
const avisosController = require("../controllers/avisos.controller.js");

const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const router = express.Router();
router.use(authenticationMiddleware);

router.get("/", avisosController.getAvisos);
router.get("/:id", avisosController.getAvisoById);

router.post("/", authorizationMiddleware.isTricel, avisosController.createAviso);

router.put("/:id", authorizationMiddleware.isTricel, avisosController.updateAviso);

router.delete("/:id", authorizationMiddleware.isTricel, avisosController.deleteAviso);

module.exports = router;