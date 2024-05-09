"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Enrutador de usuarios  */
const userRoutes = require("./user.routes.js");
/** Enrutador de roles */
const roleRoutes = require("./role.routes.js");
/** Enrutador de autenticación */
const authRoutes = require("./auth.routes.js");

/**Enrutador de periodos */
const periodoRoutes = require("./periodo.routes.js");
const procesoRoutes = require("./proceso.routes.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para los roles /api/roles
router.use("/roles", authenticationMiddleware, roleRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

// Define las rutas para los periodos /api/periodos
router.use("/periodo", authenticationMiddleware, periodoRoutes);
// Define las rutas para los procesos /api/procesos
router.use("/proceso", authenticationMiddleware,procesoRoutes);

// Exporta el enrutador
module.exports = router;
