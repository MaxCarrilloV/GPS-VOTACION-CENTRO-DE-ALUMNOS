"use strict";
const express = require("express");

/** Enrutador de usuarios, roles y autenticación  */
const userRoutes = require("./user.routes.js");
const roleRoutes = require("./role.routes.js");
const authRoutes = require("./auth.routes.js");

/**Enrutador de periodos, procesos y postulaciones */
const periodoRoutes = require("./periodo.routes.js");
const procesoRoutes = require("./proceso.routes.js");
const postulacionRoutes = require("./postulacion.routes.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
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
router.use("/proceso", authenticationMiddleware, procesoRoutes);
// Define las rutas para las postulaciones /api/postulaciones
router.use("/postulaciones", authenticationMiddleware, postulacionRoutes);

// Exporta el enrutador
module.exports = router;
