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

const {
  uploadImage,
  handleMulterError,
} = require("../utils/fileUploadHandler.js");

// Define las rutas para los usuarios

// Rutas que no requieren autenticación
// Ruta para confirmar un código de usuario
router.put("/confirm/:id", usuarioController.confirmUser);
// Ruta para crear un usuario
router.post("/", usuarioController.createUser);

// Rutas que requieren autenticación
router.get("/", authenticationMiddleware, authorizationMiddleware.isAdmin, usuarioController.getUsers);
router.get("/tricel/", authenticationMiddleware, usuarioController.getUsersTricel);
router.get("/:id", authenticationMiddleware, usuarioController.getUserById);
router.get("/email/:email", authenticationMiddleware, usuarioController.getUserByEmail);
router.put(
  "/:id",
  uploadImage.single("Imagen_Perfil"),
  handleMulterError,
  authenticationMiddleware,
  usuarioController.updateUser,
);
router.put(
  "/update-role/:id",
  authenticationMiddleware,
  authorizationMiddleware.isAdmin,
  usuarioController.updateRoleUser,
);
router.delete(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware.isAdmin,
  usuarioController.deleteUser,
);

// Exporta el enrutador
module.exports = router;
