"use strict";
// Autorizacion - Comprobar el rol del usuario
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const { respondError } = require("../utils/resHandler.js");
const { handleError } = require("../utils/errorHandler.js");

/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (const element of roles) {
      if (element.name === "admin") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de administrador para realizar esta acción",
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isAdmin");
  }
}

const hasRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.email });
      const roles = await Role.find({ _id: { $in: user.roles } });
      for (const element of roles) {
        if (element.name === roleName || element.name === "admin") {
          return next();
        }
      }
      // Si no se encuentra el rol, envía un mensaje de error
      return respondError(
        req,
        res,
        401,
        `Se requiere un rol de ${roleName} para realizar esta acción`,
      );
    } catch (error) {
      handleError(error, "authorization.middleware -> hasRole");
    }
  };
};

async function isTricel(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (const element of roles) {
      if (
        element.name === "Miembro de Tricel" ||
        element.name === "Presidente de Tricel" ||
        element.name === "admin"
      ) {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de Miembro de Tricel para realizar esta acción",
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isTricel");
  }
}

module.exports = {
  isAdmin,
  hasRole,
  isTricel,
};
