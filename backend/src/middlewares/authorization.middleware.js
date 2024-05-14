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

async function isApoderadoCee(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (const element of roles) {
      if (element.name === "Apoderado de CEE" || element.name === "admin") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de Apoderado de CEE para realizar esta acción",
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isApoderadoCee");
  }
}

module.exports = {
  isAdmin,
  isTricel,
  isApoderadoCee,
};
