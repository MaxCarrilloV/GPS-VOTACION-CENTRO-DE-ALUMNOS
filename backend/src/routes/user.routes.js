"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de usuarios */
const usuarioController = require("../controllers/user.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define las rutas para los usuarios

// Rutas que no requieren autenticación
// Ruta para confirmar un código de usuario
router.put("/confirm/:id", usuarioController.confirmUser);

// Rutas que requieren autenticación
router.get("/", authenticationMiddleware, authorizationMiddleware.isAdmin, usuarioController.getUsers);
router.post("/", authenticationMiddleware, usuarioController.createUser);
router.get("/:id", authenticationMiddleware, usuarioController.getUserById);
router.put(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware.isAdmin,
  usuarioController.updateUser,
);
router.delete(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware.isAdmin,
  usuarioController.deleteUser,
);

// Exporta el enrutador
module.exports = router;
