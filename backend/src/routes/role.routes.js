"use strict";
const express = require("express");

const rolesController = require("../controllers/role.controller.js");
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const router = express.Router();
router.use(authenticationMiddleware);

// Define las rutas para los roles
router.get("/", authorizationMiddleware.isAdmin, rolesController.getRoles);
router.post("/", authorizationMiddleware.isAdmin, rolesController.createRole);
router.delete("/:id", authorizationMiddleware.isAdmin, rolesController.deleteRole);

module.exports = router;